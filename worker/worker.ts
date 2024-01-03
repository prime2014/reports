// worker.ts
import * as amqp from 'amqplib/callback_api';
import * as sgMail from '@sendgrid/mail';

sgMail.setApiKey("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");

const queueUrl = "amqp://prime:belindat2014@localhost:5672/";

function connectToRabbitMQ() {
  amqp.connect(queueUrl, (error0, connection) => {
    if (error0) {
      console.error('Error connecting to RabbitMQ:', error0.message);
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


// Connect to RabbitMQ
connectToRabbitMQ();


// Move consume logic outside the connectToRabbitMQ function
function consumeMessages(channel) {
  channel.consume('email_queue', (msg) => {
    if (msg !== null) {
      const emailData = JSON.parse(msg.content.toString());
      sendEmail(emailData);
      channel.ack(msg); // Acknowledge the message
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
  const { to, from, subject, html, attachmentContent } = emailData;
//   console.log(emailData)

  const msg = {
    to,
    from,
    subject,
    html,
    attachments: [
      {
        content: attachmentContent,
        filename: 'attachment.pdf',
        type: 'application/pdf',
        disposition: 'attachment',
      },
    ],
  };

  await sgMail.send(msg);

  console.log(`Email sent to ${to}`);
}


