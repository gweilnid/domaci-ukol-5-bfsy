// Delay aby mock fungoval jako API
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let mockLists = [
    {
      id: 'list1',
      title: 'Potraviny',
      shoppingList: [
        { id: 'item1', name: 'Jablko', purchased: false },
        { id: 'item2', name: 'Mléko', purchased: true },
        { id: 'item3', name: 'Chleba', purchased: false },
      ],
      users: [
        { id: 'user1', email: 'user1@example.com', role: 'owner' },
        { id: 'user2', email: 'user2@example.com', role: 'user' },
        { id: 'user3', email: 'user3@example.com', role: 'user' },
      ],
      archived: false,
      ownerId: 'user1',
    },
    {
      id: 'list2',
      title: 'Kancelářské potřeby',
      shoppingList: [
        { id: 'item4', name: 'Papír', purchased: true },
        { id: 'item5', name: 'Sešívačka', purchased: false },
        { id: 'item6', name: 'Fixy', purchased: false },
      ],
      users: [
        { id: 'user2', email: 'user2@example.com', role: 'owner' },
        { id: 'user1', email: 'user1@example.com', role: 'user' },
        { id: 'user3', email: 'user3@example.com', role: 'user' }, 
      ],
      archived: false,
      ownerId: 'user2',
    },
    {
      id: 'list3',
      title: 'Domácí potřeby',
      shoppingList: [
        { id: 'item7', name: 'Čisticí prostředek', purchased: false },
        { id: 'item8', name: 'Hadr', purchased: true },
      ],
      users: [
        { id: 'user3', email: 'user3@example.com', role: 'owner' },
        { id: 'user1', email: 'user1@example.com', role: 'user' },
        { id: 'user2', email: 'user2@example.com', role: 'user' },
      ],
      archived: false,
      ownerId: 'user1',
    },
    {
      id: 'list4',
      title: 'Cestování',
      shoppingList: [
        { id: 'item9', name: 'Kufr', purchased: false },
        { id: 'item10', name: 'Mapa', purchased: true },
      ],
      users: [
        { id: 'user1', email: 'user1@example.com', role: 'owner' },
        { id: 'user2', email: 'user2@example.com', role: 'user' },
        { id: 'user3', email: 'user3@example.com', role: 'user' },
      ],
      archived: true, 
      ownerId: 'user1',
    },
  ];

// Mock API funkce
export const mockFetchLists = async () => {
  await delay(500);
  return [...mockLists];
};

export const mockCreateList = async (newList) => {
  await delay(500);
  mockLists.push(newList);
  return newList;
};

export const mockUpdateList = async (updatedList) => {
  await delay(500);
  const index = mockLists.findIndex((list) => list.id === updatedList.id);
  if (index !== -1) {
    mockLists[index] = updatedList;
  }
  return updatedList;
};

export const mockDeleteList = async (listId) => {
  await delay(500);
  const index = mockLists.findIndex((list) => list.id === listId);
  if (index !== -1) {
    mockLists.splice(index, 1);
  }
  return { id: listId };
};
