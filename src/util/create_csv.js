import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

const handleGetMessageData = (eventId) => {
  const msgRef = collection(db, eventId);
  const q = query(msgRef, orderBy("ts"), limit(200));
  let response;

  onSnapshot(q, (doc) => {
    const updateMessageList = [];

    doc.forEach((msg) => {
      updateMessageList.push({
        account: msg.data().account || "",
        message: msg.data().message || "",
        ts: msg.data().ts.toString() || "",
      });
    });

    // response = updateMessageList;
    return [];
  });
};
