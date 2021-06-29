# Link Shortener

A link shortener written in Typescript using NextJS, React and TailwindCSS

## Features

- Shorten URLs with multiple options
- Edit, delete or get a QR code for them
- View your recently shortened links in a table

## Setup

1. Download the source code

2. Set up a [Fauna Database](https://fauna.com/)

3. Set up a [Auth0](https://auth0.com/) account

4. Set up the .env file:

   ```
   AUTH0_SECRET="XXXX" // your auth0 secret
   AUTH0_CLIENT_ID="XXXX" // your auth0 client id
   AUTH0_ISSUER_BASE_URL="" // the auth0 base url
   AUTH0_BASE_URL="" // the base url of the url shortener
   AUTH0_CLIENT_SECRET="" // the auth0 client secret
   
   GO_FAUNA_SECRET_KEY_A="XXXX" // your fauna secret key with admin rights
   ```

5. It's suggested to host this service on [Vercel](https://vercel.com/) to automatically support the serverless functions

## Images

- ##### The landing page: 

  ![landing page](.\img\Landingpage.png)

- ##### Logged in view 

  ![logged in view](.\img\loggedIn.png)

- ##### Editing Modal

  ![editing modal](.\img\editingModal.png)