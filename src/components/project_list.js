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
import Project from './project';
import { connect } from 'react-redux';
import {voteProject, canMark} from '../actions/users';


class ProjectList extends Component {
    constructor(props) {
        super(props);
        this.state = {pressed: {}};
    }

    getPressedState(project) {
        if (!this.props.user) {return -1}
        if (this.props.user.data.first_option_id === project.data.id) {return 1}
        if (this.props.user.data.second_option_id === project.data.id) {return 2}
        if (this.props.user.data.third_option_id === project.data.id) {return 3}
        return 4;
    }

    renderProject(project) {
        return <Project project={project} pressed={this.getPressedState(project)} onClick={this.props.voteProject} showVote={this.props.showVote} displaySupervisorName={this.props.displaySupervisorName}/>;
    }

    getLastName(project) {
        const user = this.props.users[this.props.displaySupervisorName? project.data.supervisor_id: project.data.student_id];
        if (!user) {return project.data.id}
        const name = user.data.name;
        return name.substr(name.indexOf(' ')+1)
    }

    render() {
        const noProjects = Object.keys(this.props.projects).length;
        return Object.values(this.props.projects).sort((a, b) => {
            const x = [a.student_id !== this.props.user.data.id, !canMark(this.props.user, a), a.data.group_id, this.getLastName(a), a.data.title];
            const y = [b.student_id !== this.props.user.data.id, !canMark(this.props.user, b), b.data.group_id, this.getLastName(b), b.data.title];
            let res = 0;
            for (let i=0; i < x.length; i++) {
                res = (x[i] < y[i]) - (x[i] > y[i])
                if (res !== 0) return res;
            }
            return 0;
        }).map((project, curProject) =>
            <div key={project.data.id}>
                <div className="media">
                    {this.renderProject(project)}
                </div>
                {curProject+1 < noProjects ? <hr/>: ""}
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        user: state.users.users[state.users.loggedInID],
        users: state.users.users
    }
};  

const mapDispatchToProps = dispatch => {
    return {
        voteProject: (projectID, option) => dispatch(voteProject(projectID, option))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectList);