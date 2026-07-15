https://claude.ai/chat/337ce613-719a-43ec-a428-6c6bc7b2520d

Phase 4 — Node script
Step 1 — Install Node.js
Go to nodejs.org, download the LTS version, run the installer. Everything default is fine.
Step 2 — Set up a folder
Create a folder on your desktop called reviews-export. Put your downloaded CSV file inside it and rename it to reviews.csv.
Step 3 — Create the script
Inside that same folder create a file called generate.js

cd Desktop/reviews-export
npm install csv-parse
node generate.js
