import React from 'react'

const Course = ({ course }) => {
    const totalExercises = course.parts.reduce((sum, part) => sum + part.exercises, 0)

    return (
        <div>
        <Header courseName={course.name} />
        <Content parts={course.parts} />
        <Total totalExercises={totalExercises} />
        </div>
    )
    }

    const Header = ({ courseName }) => {
    return (
        <h1>{courseName}</h1>
    )
    }

    const Content = ({ parts }) => {
    return (
        <div>
        {parts.map(part =>
            <Part key={part.id} partName={part.name} exercises={part.exercises} />
        )}
        </div>
    )
    }

    const Part = ({ partName, exercises }) => {
    return (
        <p>{partName} {exercises}</p>
    )
    }

    const Total = ({ totalExercises }) => {
        return (
        <p><strong>total of {totalExercises} exercises</strong></p>
        )
    }

export default Course