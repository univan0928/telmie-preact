import { h, Component } from 'preact';
import style from './style.scss';
import Spinner from '../../global/spinner';
import { Link, route } from 'preact-router';
import FontAwesome from 'react-fontawesome';
import { apiRoot } from '../../../api';
import { convertDate, convertDuration } from '../../../utils';


export default class Activity extends Component {
	state = {
		expanded: false
	}
	goToPro(id){
		route('/pro/' + id);
	}
	render({activity}) {
		const contact = activity.contact;
		return (
			<div className={style.activity}>

				<div className={style.contact}  onClick={()=>{this.goToPro(contact.id)}} >
					<div className={style.avatar}>
						{(contact.avatar != null) ? (
							<img src={apiRoot + 'image/' + contact.avatar.id} alt={contact.name + ' ' + contact.lastName} />
						) : (
							<img src="/assets/nouserimage.jpg" alt={contact.name + ' ' + contact.lastName} />
						)}
					</div>
					<div className={style.info}>
						<h3>{contact.name + ' ' + contact.lastName}</h3>
							{this.props.client && (
								<div>
									CLIENT
								</div>
							)}
							{!this.props.client && contact.pro != null && (
								<div>
									{contact.pro.profession}
								</div>
							)}
					</div>
				</div>
				<div className={style.date}> { convertDate(activity.date) }</div>
				<div className={style.duration}>
					{activity.duration != null ? (
						<span>
							{convertDuration(activity.duration)}
						</span>
					) : (
						<span>00:00</span>
					)}
				</div>
				<div className={style.price}>
					{activity.amount != null ? (
						<span>
							£{activity.amount.toFixed(2)}
						</span>
					) : (
						<span>
							£0.00
						</span>
					)}
				</div>
				<div>{activity.status}</div>
				{ typeof activity.related != 'undefined' && (
					<div className={this.state.expanded ? style.relatedActivities + ' ' + style.expanded : style.relatedActivities }>
						<span className={style.relatedTitle} onClick={()=>{this.setState({expanded: !this.state.expanded})}}>
							{activity.related.length} more {activity.related.length == 1 ? 'call' : 'calls' } <span aria-hidden="true" class="fa fa-angle-down"></span>
						</span>
						<div className={style.container}>
							{ activity.related.map(related => (
							<div className={style.related}>
								<div className={style.relatedDate}> { convertDate(related.date) }</div>
								<div className={style.relatedDuration}>
									{related.duration != null ? (
										<span>
											{convertDuration(related.duration)}
										</span>
									) : (
										<span>00:00</span>
									)}
								</div>
								<div className={style.relatedPrice}>
									{related.amount != null ? (
										<span>
											£{related.amount.toFixed(2)}
										</span>
									) : (
										<span>
											£0.00
										</span>
									)}
								</div>
								<div className={style.relatedStatus}>
									{related.status}
								</div>
							</div>
						))}
						</div>
					</div>
				)}
			</div>
		)
	}
}
