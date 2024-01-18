// worker.ts
require("dotenv").config()
import * as amqp from 'amqplib/callback_api';
import * as sgMail from '@sendgrid/mail';
import axios from "axios";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const queueUrl = process.env.RABBITMQ_QUEUE_URL;


var retry = 0;

function connectToRabbitMQ() {
  amqp.connect(queueUrl, (error0, connection) => {
    if (retry > 5) throw new Error("ERROR: Could not connect to RabbitMQ")
    if (error0) {
      console.error('Error connecting to RabbitMQ:', error0.message);
      retry += 1
      setTimeout(connectToRabbitMQ, 5000); // Retry after 5 seconds
      return;
    }

    connection.createChannel((error1, channel) => {
      if (error1) {
        console.error('Error creating RabbitMQ channel:', error1.message);
        connection.close();
        return;
      }

      // Declare an exchange (e.g., direct exchange)
      const exchange = 'direct_exchange';
      const exchangeType = 'direct';
      const queue = 'email_queue';

      channel.assertExchange(exchange, exchangeType, {
        durable: true,
      });

      channel.assertQueue(queue, {
        durable: true,
      });

      // Bind the queue to the exchange with a routing key
      const routingKey = 'email_routing_key';
      channel.bindQueue(queue, exchange, routingKey);

      console.log('Worker is waiting for messages.');

      // Move the consume logic outside the connectToRabbitMQ function
      consumeMessages(channel);
    });
  });
}

// Handle RabbitMQ connection closure
function handleConnectionClose(connection) {
  console.error('RabbitMQ connection closed.');
  setTimeout(() => {
    connectToRabbitMQ();
  }, 5000); // Retry after 5 seconds
}

process.once('SIGINT', () => {
  if (connection) {
    connection.close();
  }
});



// Move consume logic outside the connectToRabbitMQ function
function consumeMessages(channel) {
  channel.consume('email_queue', (msg) => {
    if (msg !== null) {
      const emailData = JSON.parse(msg.content.toString());
      
      try {
        sendEmail(emailData);
        channel.ack(msg); 
      } catch(error){
        
        throw error;
      }
      // Acknowledge the message
    }
  }, {
    noAck: false, // Set to false to manually acknowledge messages
  });
}

let connection;
// Connect to RabbitMQ
connectToRabbitMQ();

// Helper function for sleeping (delaying execution) in an asynchronous manner
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendEmail(emailData) {
 
  // Implement the email sending logic using SendGrid
  const { to, from, subject, message, attachmentContent, requestSource } = emailData;
//   console.log(emailData)

  const msg = {
    to,
    from,
    subject,
    message,
    attachment: {
        content: attachmentContent,
        filename: 'sales_report.pdf',
        type: 'application/pdf',
        disposition: 'attachment',
    },
    requestSource 
  };

  try {
    let resp = await axios.post(process.env.EMAIL_SERVICE_BASE_URL, {emails: [msg]}, {
      headers: {
          "api-key": process.env.EMAIL_SERVICE_API_KEY,
      }
    })
    
  } catch(error) {
   
    throw error;
  }

  console.log(`Email sent to ${to}`);
}


