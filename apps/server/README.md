# This project contains the following technologies

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

# Project setup commands:
terminal powershell -> `npm i --force` (install dependencies)
terminal powershell -> `npx npm-check-updates --interactive` (update dependencies)
terminal powershell -> `npm run dev`
terminal powershell -> `npm run lint` (loading ESLint checker)

# Database commands:
terminal powershell -> `npx prisma generate`
terminal powershell -> `npx prisma db push`
terminal powershell -> `npx prisma migrate reset`

terminal powershell -> `npx prisma db seed` (loading test DB)

# GitHub commands:
terminal powershell -> `git pull origin master` (get latest changes)

terminal powershell -> `git add .` (add all changes)
terminal powershell -> `git commit -m "commit message"` (commit changes)
terminal powershell -> `git checkout -b <branch-name>` (create new branch)

terminal powershell -> `git push origin master` (push changes to master)
terminal powershell -> `git push origin master:<branch-name>` (if branch already exists)
terminal powershell -> `git push origin <branch-name>` (push changes to branch)