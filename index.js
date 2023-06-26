const mysql = require('mysql');
const util = require('util');

// Create a new MySQL connection
const connection = mysql.createConnection({
  host: '',
  user: '',
  password: '',
  database: ''
});

// Promisify the query function
const query = util.promisify(connection.query).bind(connection);

// Connect to the database
connection.connect(async (error) => {
  if (error) {
    console.error('Error connecting to the database:', error);
    return;
  }

  console.log('Connected to the MySQL database.');

  try {
    // Fetch data from the "ticketbot" table
    const data = await fetchDataFromTable();
    let id = 0;
    data.forEach(element => {
      let json = JSON.parse(element.json);
      let category = json.category;
      insertTicket(id,json, category);
      id++;
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    console.log('Disconnecting from the database...');
    connection.end();
  }
});

// Create function to insert a ticket into a mysql table 
async function insertTicket(id, ticket, category) {
  try {

    const {
      creator,
      invited,
      createdAt,
      claimed,
      claimedBy,
      claimedAt,
      closed,
      closedBy,
      closedAt,
      messageId,
      closeReason,
      transcriptURL
    } = ticket;

    const {
      codeName,
      name,
      description,
      emoji,
      color,
      categoryId,
      ticketNameOption,
      customDescription,
      cantAccess,
      askQuestions,
      questions
    } = category;

    const queryResult = await query(
      'INSERT INTO tickets (id, category_codeName, category_name, category_description, category_emoji, category_color, category_categoryId, category_ticketNameOption, category_customDescription, category_cantAccess, category_askQuestions, category_questions, creator, invited, createdAt, claimed, claimedBy, claimedAt, closed, closedBy, closedAt, messageId, closeReason, transcriptURL) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id,
        codeName ? codeName : "0",
        name ? name : "0",
        description ? description : "0", 
        emoji ? emoji : "0",
        color ? color : "0",
        categoryId ?  categoryId : "0",
        ticketNameOption ? ticketNameOption : "0",
        customDescription ? customDescription : "0",
        cantAccess ? JSON.stringify(cantAccess) : "0",
        askQuestions ? askQuestions : "0",
        questions ? JSON.stringify(questions) : "0",
        creator ? creator : "null",
        invited ? JSON.stringify(invited) : "0",
        createdAt ?   createdAt : "0",
        claimed ? claimed : "0",
        claimedBy ? claimedBy : "0",
        claimedAt ?   claimedAt : "0",
        closed ? closed : "0",
        closedBy ? closedBy : "0",
        closedAt ? closedAt : "0",
        messageId ? messageId : "0",
        closeReason ? closeReason : "0",
        transcriptURL ? transcriptURL : "0"
      ]
    );

    return queryResult;
  } catch (error) {
    console.error('Error inserting ticket into the table:', error);
  }
}

async function fetchDataFromTable() {
  try {
    const queryResult = await query('SELECT * FROM json');
    return queryResult;
  } catch (error) {
    throw new Error('Error fetching data from the table: ' + error.message);
  }
}