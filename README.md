<img src="https://media.giphy.com/media/WaGFXrmm6Jhm14tlVG/giphy.gif" width="100%" />

<br>

![GitHub Release Date](https://img.shields.io/github/release-date/shivdon/Ecommerce-world?style=for-the-badge) &nbsp;&nbsp;
![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/shivdon/Ecommerce-world?style=for-the-badge) &nbsp;&nbsp;
![GitHub watchers](https://img.shields.io/github/watchers/shivdon/Ecommerce-world?color=cyan&logo=Github&style=for-the-badge)
<br>
<br>
## Project Description

This is One Of My Largest **Full Stack _MERN_ Project** with All the Qualities Of an Ecommerce-Website 🌐. The SITE is Desployed !!
The WebSite is Live Now and In working Condition ======> <a href="https://ecommerce-world.netlify.app">Visit Website</a> 👀👀 <br> <br>

### For testing the Live Website. ===> Users are Divided into: <br>
- _Subscriber_ 👥
- _Admin_ 👤 ( For creating Products and Categories and Related Info) <br>

**FOR TESTING PURPOSES OF ADMIN** ====> CONTACT ME FOR ACCESS AT ---> <a href="mailto:mehtashivansh2022@gamil.com">MY EMAIL</a>

<hr>

### Technologies Used: 

- 🔥  **Firebase** is Used For Authentication of Users And Admins
- 🍃 **MongoDB** For saving and retrieving every bits and pieces of Data
- 💙 **ReactJS** for handling the Frontend Development
- 🟩 **NodeJS/Express** for the backend Development
- ☁  **Cloudinary** for handling IMAGES.
<hr>
<br>
<br>
<br>

### Steps For Hosting The Website Locally ==>
<hr>

**Step 1**: Clone The Repository in any Folder

```
$ git clone https://github.com/shivdon/ecommerce-world.git
```
**Step 2**: Stripe Setup for Payment Integration

Follow Link TO get Stripe Key ===> [Stripe Setup api](https://stripe.com/docs/keys)


**Step 3**: Client Environment Setup:

```
$ cd client && touch .env
$ cat > .env

REACT_APP_REGISTER_REDIRECT_URL='http://localhost:3000/register/complete'
REACT_APP_FORGOT_PASSWORD_REDIRECT='http://localhost:3000/login'
REACT_APP_API='http://localhost:8000/api'

REACT_APP_STRIPE_KEY=(get Your key from stripe by following the step 2 and paste here)
```

**step 3.5**: Installing dependencies in client folder:
```
npm install
```

**Step 4**: start the FrontEnd React Server:

```
npm start
```

<br>
## The Above Step Will start the React frontend Server Running on Port 3000 

**Step 5**: Start a NEW TERMINAL WINDOW and follow the steps given next by changing the current directory to the directory where the repository was cloned: 

```
$ cd server && touch .env
```

**Step 6**: Cloudinary Setup

[Cloudinary](https://cloudinary.com/documentation/how_to_integrate_cloudinary)

**Step 7** : Environment variables setup for server-side

```
$ cat > .env

DATABASE=mongodb://localhost:27017/ecom-world
PORT=8000

CLOUDINARY_CLOUD_NAME=(cloud_name from step 6 cloudinary setup)
CLOUDINARY_API_KEY=(cloud_key from step 6 cloudinary setup)
CLOUDINARY_API_SECRET=(cloud_secret from step 6 cloudinary setup)

STRIPE_SECRET=(from step 2 stripe secret)
```
**step 7.5**: Installing dependencies in server folder:
```
npm install
```

**Step 8**: Run the Server 
```
nodemon server.js
```

**FINAL STEP**: Go to Your Browser and type in the URL bar the Following:

`http://localhost:3000/`

<h1 align="center">CONGRATULATIONS!</h1>
<p align="center">You're Set to Explore</p>
