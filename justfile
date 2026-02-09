dev:
    (sleep 2 && open http://localhost:3000) &
    npm run dev

fmt:
    npx prettier --write .
