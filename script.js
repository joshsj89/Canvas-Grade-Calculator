const weight = {};
const scores = {};
let total_score = 0;

// Get the rows from the Weight Table
const weight_table = document.querySelector('table.summary');
const weight_tbody = weight_table.querySelector('tbody');
const weight_rows = weight_tbody.querySelectorAll('tr');

// Get the rows from the Assignment Grades Table
const course_table = document.querySelector('#grades_summary');
const course_tbody = course_table.querySelector('tbody');
const course_rows = course_tbody.querySelectorAll('tr.student_assignment.assignment_graded');

weight_rows.forEach((row) => {
    const group = row.querySelector('th').textContent;
    if (group !== 'Total') {
        // get the percentage multiplier for all groups
        weight[`${group}`] = Number(row.querySelector('td').textContent.match(/\d+/)[0])/* * 0.01*/;
        scores[`${group}`] = [0, 0];
    }
});

course_rows.forEach((row) => {
    const th = row.querySelector('th');
    const group = th.querySelector('.context').textContent;

    const tooltip = row.querySelector('.tooltip').innerText;
    grade = tooltip.match(/\d+((.\d+)?)/g);
    scores[`${group}`][0] += Number(grade[0]);

    if (grade[1]) {
        scores[`${group}`][1] += Number(grade[1]);
    } else {
        scores[`${group}`][1] += 100;
    }
});

for (const key in weight) {
    const points = scores[`${key}`][0];
    const total = scores[`${key}`][1];
    if (total !== 0) {
        total_score += points / total * weight[`${key}`];
    }
}

console.log(total_score.toFixed(2) + '%');

///////////////////////////////////////////////
// Next Steps:
//      -Find a way to account for inputted scores
//          (remove use of 'tr.assignment_graded')
//      -Account for checkmarks and non-scores
//      -Account for no Weight Table