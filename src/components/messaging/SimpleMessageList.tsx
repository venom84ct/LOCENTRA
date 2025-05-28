type MessageContact = { id: string; name: string };

const contacts: MessageContact[] = [{ id: "1", name: "John" }];

const handleSelectContact = (contact: MessageContact) => {
  console.log("Selected:", contact.name);
};

contacts.forEach((contact) => handleSelectContact(contact));
