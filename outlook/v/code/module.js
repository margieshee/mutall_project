//
import * as outlook from '../../../outlook/v/code/outlook.js';
//
import * as server from '../../../schema/v/code/server.js';
//
//A class to be implemented when creating a new class to avoid repetition.
//Once the class is called, one does not need to do anything else.
export class terminal extends outlook.baby {
    constructor(
    //
    //The mother view to the application.
    mother, 
    //
    //The html page to load
    html) {
        super(mother, html);
    }
    //
    //This method does nothing other than satisfying the contractual
    // obligation of a baby class.
    async get_result() {
        return true;
    }
}
//
//This class is the home of all methods that are common to all our modules.
//For instance, all modules should be able to report errors to the user.
export class modules {
    //
    constructor() {
        //
    }
}
//
//This class supports the registrar module developed for supporting recording of
// data to the database for all our template forms.(the writer saves the
// questionnaire)
export class writer extends modules {
    //
    //The conctructor of the class.
    constructor() {
        //
        super();
        //
    }
    //
    //For reporting any error that occurs to aid in debugging.
    report_error() {
        throw new Error('Method not implemented.');
    }
    //
    //Get the data in the form layouts and save the data to the database .
    //The return value is true if it is successful otherwise it is false.
    async save(data) {
        //
        //1. Get the layout from the input questionnaire
        const layout = data.get_layouts();
        //
        //2. use the layout and questionnaire  to load the data to the database.
        //Returning the error report or the okay message.
        const result = await server.exec(
        //
        //Use the questionnaire class to load data.
        "questionnaire", 
        //
        //The only parameter required to construct a questionnaire is layouts[].
        [layout], 
        //
        //Use the more general version of loading that returns a html report.
        "load_common", 
        //
        //Call the load common without any parameters.
        []);
        //
        //3. Check to see if the data was saved successfully if yes return true
        //if not return false with the error reporting for checking.
        return true;
    }
}
//
//The accounting class that captures transaction data in a double entry format
//which then proceeds to split into the refined data as per the DEALER model. Once
//done the transaction it is labelled as a debit or credit within an application.
//(the accounting class posts a journal)
export class accountant extends modules {
    //
    constructor() {
        //
        super();
    }
    //
    //For reporting any error that occurs to aid in debugging.
    report_error() {
        throw new Error('Method not implemented.');
    }
    //Post the given accounts to the general ledger and return true is
    //successful and false otherwise.
    async post(je) {
        //
        //1.Collect as many labels as are neccessary for effective posting of the journal
        //guided by the simple template and the accounting sub-model.(fn)
        const layouts = Array.from(this.collect_layouts(je));
        //
        //2. Use the questionnaire class in php to load the labels to the database.(pk)
        const answer = await server.exec(
        //
        //Use the questionnaire class to load data.
        "questionnaire", 
        //
        //The only parameter required to construct a questionnaire is layouts[].
        [layouts], 
        //
        //Use the more general version of loading that returns a html report.
        "load_common", 
        //
        //Call the load common without any parameters.
        []);
        //
        //3. If the loading was successful return true. (jk)
        return true;
        //
        //4. Otherwise report the error message and return false.(pm)
    }
    //
    //Collect all the layouts of the journal fro saving to the database.
    *collect_layouts(je) {
        //
        //The database to save the data.
        const dbname = "mutall_users";
        //
        //The entity name.
        const ename = "je";
        //
        //1 Get and destructure journal entries, credit and debit accounts.
        const { ref_num, purpose, date, amount } = je.get_je();
        //
        //Get the reference number
        yield [dbname, ename, [], "ref_num", ref_num];
        //
        //Get the purpose of the transaction
        yield [dbname, ename, [], "purpose", purpose];
        //
        //Get the date the transactoin was carried out.
        yield [dbname, ename, [], "date", date];
        //
        //Get the amount in the transaction
        yield [dbname, ename, [], "amount", amount];
        //
        //2 Get data for the account to credit.
        const credit = je.get_credit();
        //
        //Get the credit table.
        yield [dbname, "credit", [credit], credit, null];
        //
        //Get the account to credit the transaction
        yield [dbname, "account", [credit], "name", credit];
        //
        //3 Get the account to debit;
        const debit = je.get_debit();
        //
        //Get the debit table.
        yield [dbname, "debit", [debit], debit, null];
        //
        //Get the account to debit the transaction.
        yield [dbname, "account", [debit], "name", debit];
        //
        //4. Get the business id.
        const id = je.get_business_id();
        //
        yield [dbname, "business", [], "id", id];
        //
    }
}
//
//The messenger class supports sending of messages from one user to another but
//the functionality changes in different applications.(The messenger sends a
//message)
export class messenger extends modules {
    //
    constructor() {
        //
        super();
    }
    //
    //For reporting any error that occurs to aid in debugging.
    report_error() {
        throw new Error('Method not implemented.');
    }
    //
    async send(msg) {
        //
        //
        return true;
    }
}
//
//Allow performing of cron jobs without a persons involvement.
export class scheduler extends modules {
    //
    constructor() {
        //
        super();
    }
    //
    //For reporting any error that occurs to aid in debugging.
    report_error() {
        throw new Error('Method not implemented.');
    }
    //
    //To set the tasks that need to carried out at
    //a later time and others that are repetitive to
    //allow a user to set this tasks ahead of time
    //increasing the systems automation process.
    async exec(crj) {
        //
        //
        return true;
    }
}
//
//This class supports the payments made. This is done by invoking the accountant and
//have a record of each transaction.
export class cashier extends modules {
    //
    constructor() {
        //
        super();
    }
    //
    //For reporting any error that occurs to aid in debugging.
    report_error() {
        throw new Error('Method not implemented.');
    }
    //
    async pay(py) {
        //
        return true;
    }
}
//
//The twilio class that will support sending messages from one user to the other
class twilio extends messenger {
    //
    constructor() {
        super();
    }
    //
    //TO send the user data from twilio, two parameters are needed, namely the recievers phone number
    // and the text message
    //    async get_message(): Promise<message> {
    //        return message;
    //    }
    //
    //For reporting any error that occurs to aid in debugging.
    report_error() {
        throw new Error('Method not implemented.');
    }
    //
    //Send the message to their recipient
    async send(sms) {
        //
        //Use the twilio php class to send the message
        const result = await server.exec(
        //
        //The php class name
        "twilio", 
        //
        //An array of arguements for constructing the class object
        [], 
        //
        //The name of the method to execute
        "send_message", 
        //
        //An array of arguements that are parameters to the method
        [sms.get_sender(), sms.get_body()]);
        //
        return true;
    }
}
//
//The Whatsapp class that supports sending messages to WhatsAp group members
class whatsapp extends messenger {
    //
    //
    constructor() {
        super();
    }
    get_sender() {
        throw new Error('Method not implemented.');
    }
    get_body() {
        throw new Error('Method not implemented.');
    }
    //
    //error reporting purposes
    report_error() {
        throw new Error('Method not implemented.');
    }
    //Send the message to the whatsapp groups. In this case, should the
    async send(media) {
        //
        return true;
    }
}
//
//The mailer class that supports sending emails to users with valide email addresses
class mailer extends messenger {
    //
    //
    constructor() {
        super();
    }
    get_sender() {
        throw new Error('Method not implemented.');
    }
    get_body() {
        throw new Error('Method not implemented.');
    }
    //
    report_error() {
        throw new Error('Method not implemented.');
    }
}
