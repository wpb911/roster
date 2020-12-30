const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const util = require('util');
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

//promisify the file object for Async operation
const writeFileAsync = util.promisify(fs.writeFile);

const promptUser = () => {
    return inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'What type of employee do you wish to enter?',
        choices: [
            'Manager',
            'Engineer',
            'Intern',                
        ],
      },           
      {
        type: 'input',
        name: 'name',
        message: "What is the employee's name?",
      },      
      // {
      //   type: 'input',
      //   name: 'id',
      //   message: "Please provide the employee's id?",
      // },
      {
        type: 'input',
        name: 'email',
        message: 'Please provide the email address?',
      },
      {
        type: 'input',
        name: 'officeNumber',
        message: "Please provide the Manager's office number?",    
        when: (answers) => answers.type === 'Manager'
      },
      {
        type: 'input',
        name: 'github',
        message: "Please provide the Engineer's github username?",
        when: (answers) => answers.type === 'Engineer'
      },
      {
        type: 'input',
        name: 'school',
        message: "Please provide the Intern's school?",
        when: (answers) => answers.type === 'Intern'
      },
      {
        type: 'confirm',
        name: 'stop',
        message: "Is this the last employee you want to enter?",
        default: false,
      }, 
      
    
    ]);

};



//promptUser();

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target to this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

// Uses async/await and try/catch
const init = async () => {
  console.log('hi');
  try {      
      
      //create team array 
      let team = [];
      
      //auto generate the id numbers starting at 1
      var idnumber = 1;

      //Gather team members until finished
      while(true) {
        const answers = await promptUser();
        
        //console.log(answers);

        //Add new employees to the team array based on type
        if(answers.type === "Manager") {
          team.push(new Manager(answers.name, idnumber, answers.email, answers.officeNumber));
             
          console.log(`Id number is ${idnumber}`);   
          idnumber++;  
        }

        if(answers.type === "Engineer") {
          team.push(new Engineer(answers.name, idnumber, answers.email, answers.github)); 
              
          console.log(`Id number is ${idnumber}`); 
          idnumber++;   
        }

        if(answers.type === "Intern") {
          team.push(new Intern(answers.name, idnumber, answers.email, answers.school)); 
             
          console.log(`Id number is ${idnumber}`); 
          idnumber++;   
        }

        console.log(team);
        //console.log(`Id number is ${idnumber}`);
        
        //End the input when no more employees need to be entered
        if (answers.stop) break;
        

      }

      // const html = generateREADME(answers);
      
      // await writeFileAsync('team.html', html);
      
      // console.log('Successfully wrote to team.html');
      } catch (err) {
        console.log(err);
        }
  };
  
  init();
