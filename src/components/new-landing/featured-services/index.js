import { h } from 'preact';
import ServiceCard from '../service-card';
import style from './style.scss';

const FeaturedServices = ({services = [], title}) => {

    return (
        <div class={`${style.featuredServices} uk-container`}>
            <div class={style.header}>{title}</div>
            <div class={style.services}>
            {services.map(service => (
                <ServiceCard key={service.serviceName} {...service}/>
            ))}
            </div>
        </div>
	)
}

export default FeaturedServices;