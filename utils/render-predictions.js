import axios from "axios";
import { throttle } from "lodash";

async function sendToTelegram(webcamRef) {
  
  const response = await axios.get('https://api.telegram.org/bot7282843745:AAHL4mZZZTcghpamEvRuyxb92IYR-G7IsrE/getUpdates');
  // console.log(response.data)

  const chat_id = response.data.result[0].message.chat.id;

  //console.log(chat_id)
  // https://api.telegram.org/bot7414191093:AAEBiKarA_CqiCh91_uKs4NVXuQCJKIUM8c/sendMessage?chat_id=5830227450&text=Hello,%20world!
  //const res = await axios.post(`https://api/.telegram.org/bot7282843745:AAHL4mZZZTcghpamEvRuyxb92IYR-G7IsrE/sendMessage?chat_id=${chat_id}&text=Hello,%20world!`)
  //console.log("send to telegram")

  capturePhoto(webcamRef, chat_id);
}

export const renderPredictions = (predictions, ctx, webcamRef) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Fonts
  let font = "16px sans-serif";
  ctx.font = font;
  ctx.textBaseline = "top";

  predictions.forEach((prediction) => {
    const [x, y, width, height] = prediction["bbox"];
    const isPerson = prediction.class === "person";

    // bounding box
    ctx.strokeStyle = isPerson ? "#FF0000" : "#00FFFF";
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, width, height);

    // fill the color
    ctx.fillStyle = `rgba(255, 0, 0, ${isPerson ? 0.2 : 0})`; // Set the fill color to red
    ctx.fillRect(x, y, width, height);

    // Draw the label background.
    ctx.fillStyle = isPerson ? "#FF0000" : "#00FFFF";
    const textWidth = ctx.measureText(prediction.class).width;
    const textHeight = parseInt(font, 10); // base 10
    ctx.fillRect(x, y, textWidth + 4, textHeight + 4);

    ctx.fillStyle = "#000000";
    ctx.fillText(prediction.class, x, y);

    if (isPerson) {
      //  playAudio();
      // sendPhotoToTelegram(webcamRef);

      sendToTelegram(webcamRef)
    }
  });
};

async function sendThiefDetectedMessage(chatId, message) {
  try {
    const response = await axios.post(
      `https://api.telegram.org/bot7282843745:AAHL4mZZZTcghpamEvRuyxb92IYR-G7IsrE/sendMessage`,
      {
        chat_id: chatId,
        text: message,
      }
    );
    console.log('Message sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

async function capturePhoto(webcamRef, chatId) {
  if (webcamRef.current !== null) {
    const video = webcamRef.current.video;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageSrc = canvas.toDataURL("image/jpeg"); // Get image as base64

    // Convert base64 to Blob
    const base64Data = imageSrc.split(",")[1]; // Remove "data:image/jpeg;base64,"
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpeg" });

    // Create a FormData object
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("photo", blob, "photo.jpg"); // Append the Blob as a file
    sendThiefDetectedMessage(chatId, "Potential Thief detected.....");

    try {
      // Send POST request to Telegram API
      const response = await axios.post(
        "https://api.telegram.org/bot7282843745:AAHL4mZZZTcghpamEvRuyxb92IYR-G7IsrE/sendPhoto",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Photo sent successfully:", response.data);
      
    } catch (error) {
      console.error("Error sending photo:", error);
    }
  }
}


// const playAudio = throttle(() => {
//   const audio = new Audio("/pols-aagyi-pols.mp3");
//   audio.play();
// }, 2000);


// const sendPhotoToTelegram = throttle(async (webcamRef) => {
//   if (webcamRef.current) {
//     const imageSrc = webcamRef.current.getScreenshot();
//     const botToken = "7139781453:AAGIuNGF-xkMXXizZ082ZBm1zGBhXFxb9BI";
//     const chatId = "5830227450";

//     try {
//       console.log("Sending photo to Telegram...");
//       const response = await axios.post('/api/send-photo', {
//         imageSrc,
//         botToken,
//         chatId
//       });
//       console.log("Photo sent successfully!", response.data);
//     } catch (error) {
//       console.error("Error sending photo to Telegram:", error);
//     }
//   }
// }, 2000);