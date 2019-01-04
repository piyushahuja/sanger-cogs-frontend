/*
Copyright (c) 2018 Genome Research Ltd.

Authors:
* Simon Beal <sb48@sanger.ac.uk>

This program is free software: you can redistribute it and/or modify it
under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or (at
your option) any later version.

This program is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/


import React, {Component} from 'react';
import { connect } from 'react-redux';
import ProjectFeedbackForm from '../components/project_feedback_form'
import {fetchProject, fetchProjectMarks, requestProjects} from '../actions/projects';
import {fetchUser} from '../actions/users';
import './project_mark.css';

class ProjectFeedback extends Component {
    async componentDidMount() {
        document.title = this.props.title;
        const projectID = this.props.match.params.projectID;
        this.props.requestProjects(1);
        this.props.fetchProject(projectID);
        this.props.fetchProjectMarks(projectID);
    }

    render() {
        const projectID = this.props.match.params.projectID;
        const projectAll = this.props.projects[projectID];
        const marks = this.props.projectMarks[projectID]
        if (!projectAll || !marks) {
            return "";
        }

        return (
            <ProjectFeedbackForm
                project={projectAll}
                feedback={this.props.getMarker(marks)}
            />
        );
    }
}

const mapStateToProps = state => {
    return {
        users: state.users.users,
        projects: state.projects.projects,
        projectMarks: state.projects.projectMarks
    }
};  

const mapDispatchToProps = dispatch => {
    return {
        fetchUser: (userID) => dispatch(fetchUser(userID)),
        fetchProject: (projectID) => dispatch(fetchProject(projectID)),
        fetchProjectMarks: (projectID) => dispatch(fetchProjectMarks(projectID)),
        requestProjects: number => dispatch(requestProjects(number))
    }
};

export const ProjectFeedbackSupervisor = connect(
    mapStateToProps,
    mapDispatchToProps
)((props) => {
    return (
        <ProjectFeedback 
            title="View Supervisor Feedback"
            getMarker={marks => marks.supervisor}
            {...props}
        />
    );
});

export const ProjectFeedbackCogs = connect(
    mapStateToProps,
    mapDispatchToProps
)((props) => {
    return (
        <ProjectFeedback 
            title="View CoGS Feedback"
            getMarker={marks => marks.cogs}
            {...props}
        />
    );
});