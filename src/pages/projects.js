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
import ProjectList from '../components/project_list.js';

class Projects extends Component {
    async componentDidMount() {
        document.title = "All Projects";
    }


    render() {
        if (this.props.user === null) {
            return "";
        }
        const projects = Object.keys(this.props.projects).reduce((filtered, id) => {
            if (this.props.projects[id].data.group_id === this.props.rotation.id) {
                filtered[id] = this.props.projects[id];
            }
            return filtered;
        }, {});;
        let text = this.props.fetching? `Fetching ${this.props.fetching} more projects.`: "";
        if (this.props.fetching === 0 && Object.keys(projects).length === 0) {
            text = "There are no projects in this rotation";
        }
        return (
            <div className="container">
                {text}
                <ProjectList projects={projects} showVote={this.props.user.permissions.join_projects && this.props.rotation.student_choosable}/>
            </div>
        );
    }
}

const mapStateToProps = state => {
    if (state.users.loggedInID === null || state.rotations.latestID === null) {
        return {
            user: null,
            rotation: null
        }
    }

    return {
        user: state.users.users[state.users.loggedInID].data,
        rotation: state.rotations.rotations[state.rotations.latestID].data,
        fetching: state.projects.fetching,
        projects: state.projects.projects
    }
};  

const mapDispatchToProps = dispatch => {
    return {
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Projects);