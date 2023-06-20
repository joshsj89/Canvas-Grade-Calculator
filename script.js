const weight = {};
const scores = {};
let total_score = 0;
let total_weight = 0;

// Get the rows from the Weight Table
const weight_table = document.querySelector('table.summary');
const weight_tbody = weight_table.querySelector('tbody');
const weight_rows = weight_tbody.querySelectorAll('tr');

// Get the rows from the Assignment Grades Table
const course_table = document.querySelector('#grades_summary');
const course_tbody = course_table.querySelector('tbody');
const course_rows = course_tbody.querySelectorAll('tr.student_assignment.assignment_graded:not(.dropped)');

// Get the weight percentage for each group
weight_rows.forEach((row) => {
    const group = row.querySelector('th').textContent;
    if (group !== 'Total') {
        weight[`${group}`] = Number(row.querySelector('td').textContent.match(/\d+/)[0]);
        scores[`${group}`] = [0, 0];
    }
});

// Get the assignment percentages
course_rows.forEach((row) => {
    const th = row.querySelector('th');
    const group = th.querySelector('.context').textContent;

    const tooltip = row.querySelector('.tooltip').innerText;
    if (grade = tooltip.match(/\d+((.\d+)?)/g)) {
        scores[`${group}`][0] += Number(grade[0]);
    
        if (grade[1]) {
            scores[`${group}`][1] += Number(grade[1]);
        } else {
            scores[`${group}`][1] += 100;
        }
    } else if (grade = tooltip.match(/Complete$/)) {
        const id = row.id.match(/[^submission_]\d+/)[0];
        const score_details = document.getElementById(`score_details_${id}`);
        grade[0] = score_details.textContent.match(/Your Score:\s*(\d+(\.\d+)?)/)[1];
        grade[1] = score_details.textContent.match(/out of\s*(\d+(\.\d+)?)/)[1];
        
        scores[`${group}`][0] += Number(grade[0]);
        scores[`${group}`][1] += Number(grade[1]);
    }
});

// Total Calculation

for (const key in weight) {
    const points = scores[`${key}`][0];
    const total = scores[`${key}`][1];
    if (total !== 0) {
        total_score += points / total * weight[`${key}`];
        total_weight += weight[`${key}`];
    }
}

// If not every group has an assignment (i.e. total weight is not 100%)
if (total_weight !== 100) {
    total_score /= total_weight * 0.01;
}

console.log(total_score.toFixed(2) + '%');

//////////////////////////////////////////////////////////////////////////////////////////////////////////

if (document.getElementById('submission_final-grade')) {
    // Code to just change percentage
} else { // Create Total Score row
    // Create the <tr> element
    var trElement = document.createElement('tr');
    trElement.classList.add('student_assignment', 'hard_coded', 'final_grade', 'feedback_visibility_ff');
    trElement.setAttribute('data-muted', 'true');
    trElement.setAttribute('data-pending_quiz', 'false');
    trElement.setAttribute('id', 'submission_final-grade');
    
    // Create the <th> element for the title
    var thElement = document.createElement('th');
    thElement.classList.add('title');
    thElement.setAttribute('scope', 'row');
    thElement.textContent = 'Total';
    
    // Create the <td> element for the due date
    var tdDueElement = document.createElement('td');
    tdDueElement.classList.add('due');
    
    // Create the <td> element for the status
    var tdStatusElement = document.createElement('td');
    tdStatusElement.classList.add('status');
    tdStatusElement.setAttribute('scope', 'row');
    
    // Create the <td> element for the assignment score
    var tdScoreElement = document.createElement('td');
    tdScoreElement.classList.add('assignment_score');
    tdScoreElement.setAttribute('title', '');
    tdScoreElement.innerHTML = `
        <div style="position: relative; height: 100%;" class="score_holder">
            <span class="assignment_presenter_for_submission" style="display: none;"></span>
            <span class="react_pill_container"></span>
            <span class="tooltip">
                <span class="grade">${total_score.toFixed(2)}%</span>
            </span>
            <div style="display: none;">
                <span class="original_points"></span>
                <span class="original_score"></span>
                <span class="what_if_score"></span>
                <span class="student_entered_score"></span>
                <span class="submission_status">none</span>
                <span class="assignment_group_id"></span>
                <span class="assignment_id">final-grade</span>
                <span class="group_weight"></span>
                <span class="rules"></span>
            </div>
        </div>
    `;
    
    // Create the <td> element for the details
    var tdDetailsElement = document.createElement('td');
    tdDetailsElement.classList.add('details');
    tdDetailsElement.innerHTML = '<span class="possible points_possible" aria-label=""></span>';
    
    // Append the child elements to the <tr> element
    trElement.appendChild(thElement);
    trElement.appendChild(tdDueElement);
    trElement.appendChild(tdStatusElement);
    trElement.appendChild(tdScoreElement);
    trElement.appendChild(tdDetailsElement);
    
    course_table.appendChild(trElement);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Next Steps:
//      -Find a way to account for inputted scores
//          (remove use of 'tr.assignment_graded')
//      -Account for no Weight Table