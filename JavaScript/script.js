let currentImageIndex = 0;
const images = [
    'Images/library.jpg',
    'Images/book.jpg',  // Add more image paths
    'Images/peerReview.jpg'
];

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    document.getElementById('myImage').src = images[currentImageIndex];
}