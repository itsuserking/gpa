document.addEventListener('DOMContentLoaded', function () {

    fetch('/json/subDetails.json')
        .then(response => response.json())
        .then(data => {


            document.querySelector('.select-dept').addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('.select-sem').style.cssText = 'display:block';
            });
            document.querySelector('.select-sem').addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('#submit').style.cssText = 'display:block';
            });

            const departments = Object.keys(data);

            const deptSelect = document.getElementById('dept');



            deptSelect.innerHTML = '<option value="none">Select Department</option>';

            departments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept.toLowerCase();
                option.textContent = dept.toUpperCase();
                deptSelect.appendChild(option);
            });

            deptSelect.addEventListener('change', function () {
                const selectedDept = this.value;
                const semesterSelect = document.getElementById('semester');
                const courseContainer = document.querySelector('.course-container');

                courseContainer.innerHTML = '';

                const semesters = Object.keys(data[selectedDept].semesters);
                semesterSelect.innerHTML = '<option value="none">Semester</option>';
                semesters.forEach(semester => {
                    const option = document.createElement('option');
                    option.value = semester.toLowerCase();
                    option.textContent = semester.toUpperCase();
                    semesterSelect.appendChild(option);
                });
            });

            document.getElementById('semester').addEventListener('change', function () {
                const selectedDept = deptSelect.value;
                const selectedSemester = this.value;

                const courses = data[selectedDept].semesters[selectedSemester].courses;
                const courseContainer = document.querySelector('.course-container');

                courseContainer.innerHTML = '';

                courses.forEach(course => {
                    const courseDiv = document.createElement('div');
                    courseDiv.className = 'course mb-3 ms-2';

                    const formLabel = document.createElement('div');
                    formLabel.className = 'form-label';
                    formLabel.textContent = `${course.courseCode} - ${course.courseName}`;

                    courseDiv.appendChild(formLabel);

                    ['O', 'A+', 'A', 'B+', 'B', 'U'].forEach(grade => {
                        const formCheck = document.createElement('div');
                        formCheck.className = 'form-check form-check-inline';

                        const input = document.createElement('input');
                        input.type = 'radio';
                        input.name = `grade-${course.courseCode}`;
                        input.id = grade.toLowerCase();
                        input.value = grade;

                        const label = document.createElement('label');
                        label.for = grade.toLowerCase();
                        label.textContent = grade;

                        formCheck.appendChild(input);
                        formCheck.appendChild(label);

                        courseDiv.appendChild(formCheck);
                    });

                    courseContainer.appendChild(courseDiv);
                });
            });

            const gpaForm = document.querySelector('#gpaForm');
            gpaForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const semesterSelect = document.getElementById('semester');
                const courseCodes = data[deptSelect.value]['semesters'][semesterSelect.value]['courses'];
                const gradeValue = { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'U': 0 };
                let courseCredits = {};
                courseCodes.forEach(course => {
                    courseCredits[course.courseCode] = course.credits;
                });


                console.log(courseCredits);
                let courseGrades = {};
                const selectedGrades = document.querySelectorAll('input[type=radio]:checked');
                selectedGrades.forEach(selectedGrade => {
                    courseGrades[selectedGrade.name.split('-')[1]] = gradeValue[selectedGrade.value];
                });

                console.log(courseGrades);
                let sumOfGradePoints = 0;
                let sumOfCredits = 0;
                Object.keys(courseGrades).forEach(courseCod => {
                    if (courseGrades[courseCod] !== 0){
    
                        console.log(courseGrades[courseCod]);
                        sumOfGradePoints += parseFloat(courseGrades[courseCod]) * parseFloat(courseCredits[courseCod]);
                        sumOfCredits += parseFloat(courseCredits[courseCod]);
                    }
                });
                console.log(sumOfGradePoints);
                console.log(sumOfCredits);
                const gpa = sumOfGradePoints/sumOfCredits;
                const gpaElement = document.createElement('div');
                gpaElement.textContent = `Your GPA is ${gpa}`;
                const resultDiv = document.querySelector('#result');
                resultDiv.appendChild(gpaElement);
                resultDiv.style.cssText = "display: block;";
            });

        })
        .catch(error => console.error('Error fetching data:', error));
});


