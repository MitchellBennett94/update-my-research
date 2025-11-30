let currentImageIndex = 0;
const images = [
    'images/library.jpg',
    'images/book.jpg',  // Add more image paths
    'images/peerReview.jpg'
];

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    document.getElementById('myImage').src = images[currentImageIndex];
}