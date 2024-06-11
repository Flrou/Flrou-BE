import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyACyqV7saLjgGdrFscSemsklVxPeWGuOOo",
  authDomain: "flrou-b06fd.firebaseapp.com",
  projectId: "flrou-b06fd",
  storageBucket: "flrou-b06fd.appspot.com",
  messagingSenderId: "11065318805",
  appId: "1:11065318805:web:e6312a746c6628246e6a9c",
  measurementId: "G-JN2MZFJTDJ",

//   type: "service_account",
//   project_id: "flrou-b06fd",
//   private_key_id: "7de7a0396f7051347bb4fc5b4961616b61f9ea9c",
//   private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCIB4y/mzTBGpTk\nG7EuhHJlGAgbkEwvX89UzrLQ8dAOaS/q28o0++xVz2fFoo2n7+H7ezEm4iDs10uo\nhltkwWYnymDq9XgZ6iw8edCydiI4qAVMp6P+dsxKjnyzru4G4IF5IAFksvPArUmp\nLKA7lfm6fLXAMsuhc7yAs2fiaHRNkXJGY7vkLcjp0gFQis6vl3VsusbIM87z9iHN\nmpH3WO5VWmwtUSNOWJPEIoV5aiL/vwryjOdrld8d0x77B1qPFjn44UTBIrZmP2Ox\n6NjbfjYvcz2EsQfnMb8tL+MVjn/Ahw15mW28VeVFa9VP+5N3IXB4XedC5pohbvod\nttEplf6VAgMBAAECggEADsXvIcIL5SrrX6ioQfqNZ/BHtSKjO4PmwvmdzvZsF5yR\n4SpUmBOCE8GuLfcc9k+llcfHy0bEt6QcKeXJmDQu0YR3qRzWmc3mVv0NzsvopImO\n5cfRFio1vqUh4uvNGv8X4J06uYJ72YGYXeCkWERN9lRj8scxeUvV/Y4+aobYlrHc\nErSyDcK8isSQB8+L24svszjrqQ6uBWvA2/lpcLU9/tIOs5fE9ERoEdwNJv54IAe1\nsSrVROBGlGx9RFFhkppgZ/SlHTqlC3OJHxERgXVvpqA7pfAxRxRhbryVFoc0ENgM\n/rbcWxtOkF5FR+MtxsBoiR7IPl4TtkX+n0orkmQ0QQKBgQC90+7TqYL8QOpbKUWw\nvgug0nLETsrCoMfuSoEoR3MsL1MDhUdXSstASp7QyCuZlNfHISkOjEzkbXCxtVnV\nUwIoSC8lWFUSs9B6WfVXXRCi3clNEurI/2mkFchBsGdf1/EwPv2K+HmceZVxFTF4\nU9At0HvJpM1VUFQpi+PZLr97NQKBgQC3crLjW2xd3HX2YkWvt6L8Imolr/qke4tY\n8j9l1ZEsTg8fgr2m0mzaZdqRPpxj4qVPZ2kL+Yo1TySzDnGxMBEnx8kDfCmd8FAR\nDFcdoOxSV1U5uPEzjDz7fVYxQwuEHODTnbSAzuopaHuRWG2lKpy6bVo3eROQqPmx\nNqvlDwGB4QKBgBwqYflN4X2ENEGqcgizag5Gq3itKDCQopmcvGU5lMEtlGelUtyE\n4Ht9lurriGyVRR7qsKjT8GTESEBV5Cpe0qcfbr9fx9+qhnhg+KIp0NoZhlDFScjg\n/M+326rDfdMeu06pSf1guMqaz62js19jMDRcBsH4je7mqFYxx3DmGssxAoGAKRPa\n8MQhAOeD1pbsycsSCOlf4W6Fbl1nt5QPFCt9ZXFZO5IYC4nk7AaQqaNee5NdtukO\nAatwAj3llt6uIKIFxWWcIlakLwSHuTmNLEpDgLCjmdhK0mMdqKbJLSC5LG0W/uu6\nZnluv7TwrnwhmTFwhOJFqFRJSEQ+HSuD1DfG+6ECgYAnSHegT3FWGUR8U6rqW+TR\nlPbj9Lv0GPTU0wgh079KAd3sYrUVQ27uOn4lD0cJNqa4LMG8D966JyswKsqFjcAY\n9Cd0DzUXG3vQxphHhnTXRI3JMd2A8yxrPvB8p7ARB15PNpT9VkvUuKvUm8j0mPOk\naZAtNMdUoV4qBJ6F+L8fDQ==\n-----END PRIVATE KEY-----\n",
//   client_email: "firebase-adminsdk-gp0ku@flrou-b06fd.iam.gserviceaccount.com",
//   client_id: "109175998281956341941",
//   auth_uri: "https://accounts.google.com/o/oauth2/auth",
//   token_uri: "https://oauth2.googleapis.com/token",
//   auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//   client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-gp0ku%40flrou-b06fd.iam.gserviceaccount.com",
//   universe_domain: "googleapis.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { app, messaging }