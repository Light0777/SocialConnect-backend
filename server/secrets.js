// secrets.js
// server/secrets.js
const secrets = {
  dbUri: "mongodb+srv://Lightyagami:7502922716@sociallink.cuv9k7b.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=SocialLink"
};

export const getSecret = (key) => secrets[key];
