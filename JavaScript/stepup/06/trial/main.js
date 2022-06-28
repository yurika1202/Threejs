async function displayMessage() {
  const response = await fetch('./hello.json');
  const date = await response.json();
  const messageElm = document.querySelector('.message');
  messageElm.innerHTML = date.message;
}
displayMessage();
