const express = require("express");
const {route: lastLoginValidationRoute} = require("./routes/last-login-validation");
const {route: loginRoute} = require("./routes/login");
const {route: registerRoute} = require("./routes/register");

app = express();
app.use('/auth/last-login-date-validation', lastLoginValidationRoute);
app.use('/auth/login', loginRoute);
app.use('/auth/register', registerRoute);



const PORT = 8081;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
