// GitHub Articles Fetcher Script
document.addEventListener('DOMContentLoaded', async function() {
  const articlesContainer = document.querySelector('.w-full.h-full.bg-color-c1.container');
  const owner = 'Hu8MA';
  const repo = 'Hu8MA.github.io';
  const path = 'Articles';
  
  try {
    // First, get the contents of the repository folder
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch repository contents: ${response.status}`);
    }
    
    const contents = await response.json();
    
    // Filter for only markdown files
    const markdownFiles = contents.filter(file => file.name.endsWith('.md'));
    
    // Keep track of all promises for fetching file content
    const filePromises = markdownFiles.map(async file => {
      // Get raw file content
      const fileResponse = await fetch(file.download_url);
      
      if (!fileResponse.ok) {
        throw new Error(`Failed to fetch file ${file.name}: ${fileResponse.status}`);
      }
      
      const fileContent = await fileResponse.text();
      
      // Get file metadata for the date
      const metaResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?path=${path}/${file.name}&per_page=1`);
      
      if (!metaResponse.ok) {
        throw new Error(`Failed to fetch metadata for ${file.name}: ${metaResponse.status}`);
      }
      
      const metaData = await metaResponse.json();
      const lastCommitDate = metaData[0]?.commit?.committer?.date || new Date().toISOString();
      // Format date as MM/DD/YYYY
      const dateObj = new Date(lastCommitDate);
      const formattedDate = `${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getDate().toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
      
      // Extract title from markdown file (supporting multiple heading levels: #, ##, ###, etc.)
      const titleMatch = fileContent.match(/^(#{1,6})\s+(.+)$/m) || ['', '#', 'Untitled Article'];
      // For the title, we'll try to find a more prominent heading or use the filename
      // Look for the first heading - could be a title without ## prefix
      let title = titleMatch[2].trim();
      
      // If filename contains a descriptive name, use it as a fallback or enhancement
      const fileNameTitle = file.name.replace('.md', '').replace(/-/g, ' ').replace(/_/g, ' ');
      if (fileNameTitle.length > 5 && title === 'Introduction') {
        // If the heading is just "Introduction" but filename is descriptive, use filename instead
        title = fileNameTitle.charAt(0).toUpperCase() + fileNameTitle.slice(1);
      }
      
      // Extract first 20 words for the description
      // FIXED: Remove ALL markdown headings from the content (not just the title)
      const plainContent = fileContent
        // First remove the title heading
        .replace(new RegExp(`^${titleMatch[1]}\\s+${titleMatch[2]}`, 'm'), '')
        // Then remove any other markdown headings that might be in the content
        .replace(/^#{1,2}\s+.*$/gm, '')
        .trim();
        
      const words = plainContent.split(/\s+/);
      // FIXED: Don't include the heading prefix in the description
      const description = words.slice(0, 20).join(' ') + (words.length > 20 ? '...' : '');
      
      // Extract the first image URL if present
      const imageMatch = fileContent.match(/!\[.*?\]\((.*?)\)/);
      const imageUrl = imageMatch ? imageMatch[1] : 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';
      
      // Get the filename without extension for the article ID
      const articleId = file.name.replace('.md', '');
      
      return {
        title,
        description,
        date: formattedDate,
        imageUrl,
        articleId
      };
    });
    
    // Wait for all file processing to complete
    const articles = await Promise.all(filePromises);
    
    // Sort articles by date (newest first)
    articles.sort((a, b) => {
      const dateA = new Date(a.date.split('/')[2], parseInt(a.date.split('/')[0]) - 1, a.date.split('/')[1]);
      const dateB = new Date(b.date.split('/')[2], parseInt(b.date.split('/')[0]) - 1, b.date.split('/')[1]);
      return dateB - dateA;
    });
    
    // Create HTML for all the article cards
    const articlesHTML = articles.map(article => `
      <!-- Article Card -->
      <a href="article.html?id=${article.articleId}" class="block rounded-lg overflow-hidden my-6 shadow-md hover:shadow-color-c5 transelator">
        <div class="flex flex-col md:flex-row bg-gray-800">
          <div class="md:w-[30%]">
            <img class="h-64 w-64 object-cover md:h-full" src="${article.imageUrl}" alt="${article.title}">
          </div>
          <div class="md:w-3/5 p-6 text-white">
            <h2 class="text-3xl font-bold mb-2">${article.title}</h2>
            <p class="text-lg">${article.description}</p>
            <p class="text-lg">Last updated: ${article.date}</p>
          </div>
        </div>
      </a>
    `).join('');
    
    // Add the articles after the heading section
    const headingSection = articlesContainer.querySelector('.w-full.h-full.flex.my-6.p-6.items-center.gap-5');
    
    if (headingSection) {
      headingSection.insertAdjacentHTML('afterend', articlesHTML);
      
      // Remove the example card if it exists
      const exampleCard = articlesContainer.querySelector('a[href="#"].block.rounded-lg.overflow-hidden.my-6.shadow-md');
      if (exampleCard) {
        exampleCard.remove();
      }
    } else {
      // If heading section not found, just append to the container
      articlesContainer.insertAdjacentHTML('beforeend', articlesHTML);
    }
    
    console.log(`Successfully loaded ${articles.length} articles`);
    
  } catch (error) {
    console.error('Error fetching or processing articles:', error);
    
    // Show error message on the page
    articlesContainer.insertAdjacentHTML('beforeend', `
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-6" role="alert">
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline"> Failed to load articles: ${error.message}</span>
      </div>
    `);
  }
});