interface Contact {
  id: string;
  name: string;
  messageStatus?: string;
}

const contacts: Contact[] = [
  { id: "1", name: "Alice", messageStatus: "read" },
  { id: "2", name: "Bob", messageStatus: "unread" },
];

contacts.forEach((contact) => {
  console.log(contact.name, contact.messageStatus);
});
