# task-list-app

Deployment:
https://task-list-app-13092021.herokuapp.com/

Instructions for local run:

## Start up the backend

1.  Install packages using `npm install`. If you're on Ubuntu and prefer
    yarn, use `yarn install`
2.  Start up server.js using `npm run start`

## Start up the web app

1.  Navigate to `root/web`
2.  Start up next.js using `npm run local`
3.  Open page.html on any browser. It is set to query server.js at
    `http://localhost:3000`

The default login:
Username: yihfoo@gmail.com
Password: AtD9EXiv2q
Note that this is definitely not recommended in production!
I'd also encrypt the password

# Note on Deployment

Backend is deployed on heroku, while nextjs frontend is deployed with Vercel

Needs to run only 1 dyno: "backend" defined in Procfile
On default deployment, only web dyno will start
Start backend with `heroku ps:scale backend=1`
