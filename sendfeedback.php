<?php
require 'phpmailer/PHPMailer/PHPMailerAutoload.php';


   
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

$feedback = $_POST['data'];

$mail->addAddress('crysis.gomez@gmail.com', 'Drummer');  // Add a recipient
$mail->WordWrap = 50;                                 // Set word wrap to 50 characters      // Add attachments

$mail->Subject = 'feedback';
$mail->Body    = $feedback;

if(!$mail->send()) {
  echo 'Message could not be sent.';
  echo 'Mailer Error: ' . $mail->ErrorInfo;
   exit;
}

?>