// import { FaRegCalendarAlt, FaQrcode, FaFileDownload } from "react-icons/fa";
// import styles from "./ServiceCard.module.css";

// const ServicesSec = () => {
//   const services = [
//     {
//       icon: <FaRegCalendarAlt className={styles.icon} />,
//       title: "Easy Event Creation",
//       description: "Host your event in minutes."
//     },
//     {
//       icon: <FaQrcode className={styles.icon} />,
//       title: "QR Registrations",
//       description: "Attendees register via QR."
//     },
//     {
//       icon: <FaFileDownload className={styles.icon} />,
//       title: "Downloadable Reports",
//       description: "Export data to Excel."
//     }
//   ];

//   return (
//     <section className={styles.section}>
//       <div className="container">
//         <h3 className={styles.heading}>Our Services</h3>
//         <div className={styles.cardsContainer}>
//           {services.map((service, idx) => (
//             <div key={idx} className={styles.card}>
//               {service.icon}
//               <h4 className={styles.cardTitle}>{service.title}</h4>
//               <p className={styles.cardDescription}>{service.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ServicesSec;


import { FaRegCalendarAlt, FaQrcode, FaFileDownload } from "react-icons/fa";
import styles from "./ServiceCard.module.css";
import { MdQrCode2 } from "react-icons/md";
const ServicesSec = () => {
  const services = [
    {
      icon: <FaRegCalendarAlt className={styles.icon} />,
      title: "Easy Event Creation",
      description: "Host your event in minutes."
    },
    {
      icon: <MdQrCode2  className={styles.icon} />,
      title: "QR Registrations",
      description: "Attendees register via QR."
    },
    {
      icon: <FaFileDownload className={styles.icon} />,
      title: "Downloadable Reports",
      description: "Export data to Excel."
    }
  ];

  return (
    <section className={styles.section}>
      <div className="container">
        <h3 className={styles.heading}>Our Services</h3>
        <div className={styles.cardsContainer}>
          {services.map((service, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.iconWrapper}>{service.icon}</div>
              <h4 className={styles.cardTitle}>{service.title}</h4>
              <p className={styles.cardDescription}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSec;
