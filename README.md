This project contains the following technologies

Authentication and User Management:
- Bcrypt (password hashing)
- JSON Web Token (securely transmitting information)

Data Fetching and State Management:
- Prisma 6 (ORM for DB)

Middleware and Server Utilities:
- Concurrently (all projects are running in tandem)
- Express 5
- Morgan (logger middleware)

Utilities and Libraries:
- Knip (code analyzer and declutter)



To run the client and server via concurrently:
npm run all
npm run knip

npx prisma generate
npx prisma db push
npx prisma db pull
npx prisma db seed (loading test DB)
npx prisma migrate reset