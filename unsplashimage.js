// fetch('https://api.unsplash.com/photos/random?query=programming&count=10&client_id=wtNLH9ntnLjgM6Lonekacv56aJp0g2mIlqKJihknNFM')
// .then(response => response.json())
// .then(data => {
//   // Since 'data' is now an array of images
//   console.log(data);
  
//   // You can use the first image as before
//   document.getElementById('dynamic-image').style.backgroundImage = `url(${data[0].urls.regular})`;
  
//   // Or iterate through all images to display them
//   data.forEach((image, index) => {
//     // Create new elements for each image or handle them as needed
//     console.log(`Image ${index + 1}:`, image.urls.regular);
//   });
// })
// .catch(error => {
//   // Fallback image in case of API failure
//   document.getElementById('dynamic-image').style.backgroundImage = 'url(https://images.unsplash.com/photo-1544847558-3ccacb31ee7f)';
//   console.error('Error fetching images:', error);
// });

// https://drive.google.com/thumbnail?id=YOUR_FILE_ID&sz=w2000