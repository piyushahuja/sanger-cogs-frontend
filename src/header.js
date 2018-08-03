import React, {Component} from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import moment from 'moment';
import { withRouter } from 'react-router-dom'



class Header extends Component {
    getActiveKey() {
        return this.props.location.pathname;
    }

    renderLink(link, name, do_render) {
        if (!do_render) return;
        return (
            <NavItem eventKey={link}>{name}</NavItem>
        );
    }

    renderLeftNav() {
        const user = this.props.loggedInUser.data;
        const permissions = user.permissions;
        const mostRecentGroup = this.props.mostRecentGroup.data;
        return (
            <Nav activeKey={this.getActiveKey()}>
                {this.renderLink("/", "Home", true)}
                {this.renderLink("/projects/create", "Create Project", permissions.create_projects && !mostRecentGroup.read_only)}
                {this.renderLink("/projects/markable", "My Markable Projects", permissions.create_projects || permissions.review_other_projects)}
                {this.renderLink("/projects", "All Projects", permissions.view_projects_predeadline || mostRecentGroup.student_viewable)}
                {this.renderLink("/projects/upload", "Upload final project", user.can_upload_project)}
            </Nav>
        );
    }

    renderRightNav() {
        const user = this.props.loggedInUser.data;
        const permissions = user.permissions;
        const mostRecentGroup = this.props.mostRecentGroup.data;
        const studentChoicePassed = moment.utc(mostRecentGroup.student_choice).valueOf() - moment.utc() < 0
        return (
            <Nav pullRight={true} activeKey={this.getActiveKey()}>
                {this.renderLink("/choices/view", "View Student Choices", permissions.set_readonly && mostRecentGroup.student_choosable)}
                {this.renderLink("/choices/finalise", "Finalise Student Choices", permissions.set_readonly && mostRecentGroup.can_finalise)}
                {this.renderLink("/rotations/create", "Create Rotation", permissions.create_project_groups && studentChoicePassed)}
                {this.renderLink("/emails/edit", "Edit Email Templates", permissions.modify_permissions)}
                {this.renderLink("/users/edit", "Edit Users", permissions.modify_permissions)}
                {this.renderLink("/login", "Login", !user)}
            </Nav>
        );
    }

    render() {
        return (
            <Navbar staticTop={true} fluid={true} collapseOnSelect={true} onSelect={(eventKey, event) => {
                    this.props.history.push(eventKey);
                }}>
                <Navbar.Header>
                    <Navbar.Brand>
                        PhD Student Portal
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                </Navbar.Header>
                <Navbar.Collapse>
                    {this.renderLeftNav()}
                    {this.renderRightNav()}
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default withRouter(Header);