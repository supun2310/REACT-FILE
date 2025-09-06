import { Client, Storage } from "appwrite";

const client = new Client()
  .setEndpoint("https://syd.cloud.appwrite.io/v1") // Your Appwrite endpoint
  .setProject("6881e1e60004b624f86d"); // Your Project ID

const storage = new Storage(client);

export { client, storage };
