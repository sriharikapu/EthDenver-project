import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import styled from 'styled-components';
import DialogContent from '@material-ui/core/DialogContent';
import Button from './Button';
import { LARGE, DUSK } from '../Utils/constant';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { connect } from 'react-redux';
import { setupGroups } from '../redux/actions';

class CreateNewGroupModal extends Component {
	state = {
		inputArray: [ '' ],
		groupName: [ '' ],
		group: 'null',
		groupNumber: 0,
		memberCount: null
	};

	createGroup = async () => {
		const { setupGroups } = this.props;
		console.log('create group!');
		console.log('this.state.groupNumber', this.state.groupNumber);
		// event.preventDefault();

		const { contract } = this.props;
		// return total number of groups
		const response = await contract.methods.createGroup('test', this.state.groupNumber).call();
		console.log('total number of groups', response);
		setupGroups(response);
		// Update state with the result.
		this.setState({
			groupNumber: response <= this.state.groupNumber ? parseInt(this.state.groupNumber) + 1 : response
		});
		this.readGroup();
	};

	readGroup = async () => {
		// event.preventDefault();

		const { contract } = this.props;
		const response = await contract.methods.readGroup(this.state.groupNumber).call();
		console.log('readGroup', response);
		return response;
	};

	handleOnClick = async () => {
		console.log('create group!');

		const { contract } = this.props;
		for (var i = 0; i < this.state.inputArray.length; i++) {
			try {
				const response = await contract.methods
					.joinGroup(this.state.inputArray[i], this.state.groupNumber)
					.call();
			} catch (e) {
				console.log(e);
				break;
			}
		}
		var group = [];
		group.push(this.state.group.toString());
	};

	onTextChange = (address, index) => {
		const { inputArray } = this.state;
		let newInputArray = inputArray;
		newInputArray[index] = address;
		this.setState({ inputArray: newInputArray });
	};

	onNameChange = (name, index) => {
		const { groupName } = this.state;
		let newName = groupName;
		newName[index] = name;
		this.setState({ groupName: newName, group: name });
		Object.assign(this.props.treeGroup, groupName);
	};

	handleOnAdd = () => {
		const { inputArray } = this.state;
		this.setState({ inputArray: inputArray.concat(''), memberCount: parseInt(this.state.memberCount) + 1 });
		Object.assign(this.props.groupArray, this.state.inputArray);
	};

	handleChange = async (e) => {
		console.log(e.target.value);
		this.setState({ input: e.target.value });
	};

	updateGroup = async (e) => {
		console.log(e.target.value);
		this.setState({ group: e.target.value });
	};

	resetModal = () => {
		this.setState({
			inputArray: [ '' ],
			groupName: [ '' ],
			input: null,
			group: 'null',
			groupNumber: null,
			memberCount: null
		});
	};

	render() {
		const { closeModal, showModal, action, message, title, disableBackdropClick } = this.props;
		const { inputArray, groupName } = this.state;
		return (
			<div>
				<Dialog
					// disableBackdropClick={true}
					aria-describedby="alert-dialog-description"
					onClose={closeModal && this.resetModal}
					aria-labelledby="simple-dialog-title"
					open={showModal}
					fullWidth={true}
					maxWidth={'xs'}
					PaperProps={{
						style: {
							width: '734px',
							borderRadius: '11px',
							backgroundColor: DUSK
						}
					}}
				>
					<DialogTitle id="simple-dialog-title">
						<span style={{ color: 'white' }}>Create New Group</span>
					</DialogTitle>
					<DialogContent>
						<TextWhite>Group Name: </TextWhite>
						{groupName.map((item, index) => (
							<TextInput
								value={item}
								key={index}
								onChange={({ target }) => this.onNameChange(target.value, index) && this.updateGroup}
								placeholder={'e.g. company name'}
							/>
						))}
						<TextWhite>Assign Members</TextWhite>
						{inputArray.map((item, index) => (
							<TextInput
								value={item}
								key={index}
								onChange={({ target }) => this.onTextChange(target.value, index)}
								placeholder={'0xb4124cEB3451....004d8a28c6eE7'}
							/>
						))}
						<AddBoxIcon onClick={this.handleOnAdd} />
					</DialogContent>
					<ActionWrapper>
						<Button
							width={150}
							label={'Create'}
							handleOnClick={() => {
								this.handleOnClick();
								this.createGroup();
								closeModal();
							}}
						/>
					</ActionWrapper>
				</Dialog>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	console.log(state);
	return {
		web3: state.common.web3,
		accounts: state.common.accounts,
		contract: state.common.contract
	};
};

const mapDispatchToProps = {
	setupGroups
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateNewGroupModal);

const TextInput = styled.input`
	height: 51px;
	background-color: #36435d;
	border: none;
	padding: 5px 10px;
	box-sizing: border-box;
	width: 100%;
	caret-color: white;
	margin-bottom: 10px;
	::placeholder {
		color: rgba(255, 255, 255, 0.3);
		font-size: 15px;
	}
	&:focus {
		outline: none;
	}
`;
const TextWhite = styled.div`
	color: white;
	display: flex;
	margin: 50px 0;
	font-size: ${LARGE};
`;
const DialogContentWrapper = styled.div`
	display: flex;
	justify-content: center;
`;
const ActionWrapper = styled.div`
	display: flex;
	margin-bottom: 30px;
	justify-content: space-around;
`;
