fetch('https://app.seventy-seven.dev/api/tickets', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer YWYzNzU3NmQtZWQyYi00NTNiLTllOWQtNGYyODIyNjI2ZDI0X2E0ZmNiZjYzLWVmYmItNGMzMi05YTU2LWM5ZjZlMjg2MTQxNg==`,
  },
  body: JSON.stringify({
    subject: 'My first ticket',
    body: 'This is my first ticket, please help me with something',
    senderFullName: 'John Doe',
    senderEmail: '980321steven@gmail.com,
    senderAvatarUrl: 'https://.../avatar.jpg', // Optional field
  }),
})