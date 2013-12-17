<?php
require 'phpmailer/PHPMailer/PHPMailerAutoload.php';

//if ($_SERVER['REQUEST_METHOD'] === 'POST') {
   
$mail = new PHPMailer(true);
$mail->From = 'crysis.gomez@gmail.com';
$mail->FromName = 'drumnotes';
$mail->IsSMTP();
$mail->SMTPAuth   = true;                  // enable SMTP authentication
$mail->SMTPSecure = "tls";                 // sets the prefix to the servier
$mail->Host       = "smtp.gmail.com";      // sets GMAIL as the SMTP server

$mail->Port       = 587;                   // set the SMTP port for the GMAIL server

$mail->Username   = "crysis.gomez@gmail.com";  // GMAIL username

$mail->Password   = "";      

$data = $_POST['data'];
$name = $_POST['name'];
$address = $_POST['email'];

$image = explode('base64,',$data);

$image_name = (string)$name . '.png';
file_put_contents($image_name, base64_decode($image[1]));


//$mail->SetFrom('Drumnotes', 'Drumnotes');
$mail->addAddress($address, 'Drummer');  // Add a recipient
$mail->WordWrap = 50;                                 // Set word wrap to 50 characters
$mail->addAttachment($image_name);        // Add attachments

$mail->Subject = 'Drum notes';
$mail->Body    = 'Image';
$mail->AltBody = 'song';

if(!$mail->send()) {
  echo 'Message could not be sent.';
  echo 'Mailer Error: ' . $mail->ErrorInfo;
   exit;
}

echo "Done";

unlink($image_name);

?>
