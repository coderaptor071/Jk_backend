const template = (port) => {
  return `
  <!doctype html>
  <html lang="en">
  <head> </head>
  <body>
  <h1>
  Server is up and runnning ${port}
   </h1 > 
   </body>
  </html> `;
};
module.exports = {
  template,
};
