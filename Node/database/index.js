let books = [
    {
        ISBN: "12345ONE",
        title: "getting started with mern",
        authors: [1,2], // authot id
        language:"en",
        pubDate: "2021-07-07",
        numOfPage: 209,
        category: ["fiction", "programming", "tech", "web dev"],
        publication: 1,
    },
    {
        ISBN: "12345TWO",
        title: "getting started with Python",
        authors: [1,2], // author id
        language:"en",
        pubDate: "2021-07-07",
        numOfPage: 209,
        category: ["fiction",  "tech", "web dev"],
        publication: 1,
    }
];

let authors =[
    {
       id: 1,
       name: "pavan",
       books: ["12345ONE"],
    },
    {
        id: 2,
        name: "Deepak",
        books: ["12345ONE"],
     },

];

let publications =[
    {
    id: 1,
    name: "Chakra",
    books: ["12345ONE"],
    },
    {
        id: 2,
        name: "Vickie Publications",
        books: [],
    }
];

module.exports ={ books, authors, publications};

