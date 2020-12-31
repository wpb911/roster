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
        message: "What is the employee's name(1st letter capital, no numbers)?",
        validate: function (value) {
          var pass = value.match(
            /^[A-Z][a-zA-Z]+$/
          );
          if (pass) {
            return true;
          }
    
          return 'Please enter a valid name';
        },
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
        validate: function (value) {
          var pass = value.match(
            /\b[\w.!#$%&’*+\/=?^`{|}~-]+@[\w-]+(?:\.[\w-]+)*\b/
          );
          if (pass) {
            return true;
          }
    
          return 'Please enter a valid email address';
        },
      },
      {
        type: 'input',
        name: 'officeNumber',
        message: "Please provide the Manager's office number?(numbers, letters, dashes only",
        validate: function (value) {
          var pass = value.match(
            /^[A-Z0-9\-]+$/
          );
          if (pass) {
            return true;
          }
    
          return 'Please enter a valid office number';
        },
            
        when: (answers) => answers.type === 'Manager'
      },
      {
        type: 'input',
        name: 'github',
        message: "Please provide the Engineer's github username?(all lowercase and numbers)",
        validate: function (value) {
          var pass = value.match(
            /^[a-z0-9]+$/
          );
          if (pass) {
            return true;
          }
    
          return 'Please enter a valid github username';
        },
        when: (answers) => answers.type === 'Engineer'
      },
      {
        type: 'input',
        name: 'school',
        message: "Please provide the Intern's school?(1st letter capital, numbers allowed)",
        validate: function (value) {
          var pass = value.match(
            /^[A-Z][a-zA-Z0-9]+$/
          );
          if (pass) {
            return true;
          }
    
          return 'Please enter a valid school name';
        },
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

      //Input team members until manager chooses to stop
      while(true) {

        //Ask for information on specific team member
        const answers = await promptUser();
                
        //Add new employees to the team array based on employee type
        if(answers.type === "Manager") {
          team.push(new Manager(answers.name, idnumber, answers.email, answers.officeNumber));
          
        }

        if(answers.type === "Engineer") {
          team.push(new Engineer(answers.name, idnumber, answers.email, answers.github)); 
            
        }

        if(answers.type === "Intern") {
          team.push(new Intern(answers.name, idnumber, answers.email, answers.school)); 
                             
        }

        //increment ID number for next employee
        idnumber++;   

        console.log(team);
                
        //End the input when no more employees need to be entered
        if (answers.stop) break;        
        
      }

      //render the team from the array to HTML 
      const teamRender = render(team);

      // if output directory exists then write HTML file to output directory 
      // if not create directory then write HTML file to output directory 
      if (fs.existsSync(OUTPUT_DIR)) {
        await writeFileAsync(outputPath, teamRender);
        //fs.writeFileSync(outputPath, teamRender);
        console.log('The path exists. : ' + OUTPUT_DIR);
      } 
      else {
          fs.mkdirSync(OUTPUT_DIR);
          await writeFileAsync(outputPath, teamRender);
          console.log('Path created. : ' + OUTPUT_DIR);
        }
        
      
      } catch (err) {
        console.log(err);
        }
  };
  
  init();
