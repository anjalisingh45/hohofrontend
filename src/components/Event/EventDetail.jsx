import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import QRCode from 'react-qr-code';
import { fetchEvent, fetchEventRegistrations } from '../../redux/slices/eventSlice';
import { exportRegistrations } from '../../redux/slices/registrationSlice';
import styles from './EventDetail.module.css';

const EventDetail = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const { currentEvent, registrations, isLoading } = useSelector((state) => state.events);
  const qrRef = useRef(null);
  
  useEffect(() => {
    if (eventId) {
      dispatch(fetchEvent(eventId));
      dispatch(fetchEventRegistrations(eventId));
    }
  }, [dispatch, eventId]);

  const handleExport = async () => {
    try {
      await dispatch(exportRegistrations(eventId)).unwrap();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Function to create enhanced QR image with company name and venue
  const createEnhancedQRImage = async () => {
    return new Promise((resolve, reject) => {
      try {
        const svg = qrRef.current.querySelector('svg');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions for enhanced image
        canvas.width = 600;
        canvas.height = 800;
        
        // Create white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set text styles
        ctx.textAlign = 'center';
        ctx.fillStyle = '#333';
        
        // Company/Event Title
        ctx.font = 'bold 32px Arial';
        ctx.fillText(currentEvent.title, canvas.width / 2, 60);
        
        // Event Date
        const eventDate = new Date(currentEvent.date).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        ctx.font = '24px Arial';
        ctx.fillText(eventDate, canvas.width / 2, 100);
        
        // Event Time
        // ctx.font = '20px Arial';
        // ctx.fillText(currentEvent.time, canvas.width / 2, 130);
        
        // Load and draw QR code
        const qrImg = new Image();
        qrImg.onload = () => {
          // Draw QR code in center
          const qrSize = 300;
          const qrX = (canvas.width - qrSize) / 2;
          const qrY = 180;
          
          ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
          
          // Venue information at bottom
          ctx.font = 'bold 26px Arial';
          ctx.fillStyle = '#2c3e50';
          ctx.fillText('Venue:', canvas.width / 2, qrY + qrSize + 60);
          
          // Venue name (handle long text)
          ctx.font = '22px Arial';
          ctx.fillStyle = '#34495e';
          const venueText = currentEvent.venue;
          const maxWidth = canvas.width - 40;
          const words = venueText.split(' ');
          let line = '';
          let y = qrY + qrSize + 100;
          
          for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && i > 0) {
              ctx.fillText(line, canvas.width / 2, y);
              line = words[i] + ' ';
              y += 30;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line, canvas.width / 2, y);
          
          // Scan instruction
          ctx.font = '18px Arial';
          ctx.fillStyle = '#7f8c8d';
          ctx.fillText('Scan to Register', canvas.width / 2, y + 50);
          
          // Convert canvas to blob
          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/png', 0.9);
        };
        
        qrImg.onerror = () => {
          reject(new Error('Failed to load QR code'));
        };
        
        qrImg.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
        
      } catch (error) {
        reject(error);
      }
    });
  };

  // Function to download enhanced QR code
  const handleDownloadQR = async () => {
    try {
      const blob = await createEnhancedQRImage();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentEvent.title.replace(/[^a-zA-Z0-9]/g, '_')}-Registration-QR.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download QR code');
    }
  };

  // Function to share enhanced QR code
  const handleShareQR = async () => {
    try {
      const blob = await createEnhancedQRImage();
      const file = new File([blob], `${currentEvent.title.replace(/[^a-zA-Z0-9]/g, '_')}-Registration-QR.png`, { 
        type: 'image/png' 
      });
      
      // Check if Web Share API is supported
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: `${currentEvent.title} - Registration`,
            text: `Register for ${currentEvent.title} at ${currentEvent.venue}`,
            files: [file]
          });
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error('Share failed:', error);
            fallbackShare(blob);
          }
        }
      } else {
        // Fallback for browsers that don't support Web Share API
        fallbackShare(blob);
      }
    } catch (error) {
      console.error('Share failed:', error);
      alert('Failed to share QR code');
    }
  };

  // Fallback share method
  const fallbackShare = (blob) => {
    const url = URL.createObjectURL(blob);
    
    // Copy registration URL to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentEvent.registrationUrl).then(() => {
        // Also provide download link
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentEvent.title.replace(/[^a-zA-Z0-9]/g, '_')}-Registration-QR.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        alert('Registration URL copied to clipboard and QR image downloaded!');
      });
    } else {
      // Create a temporary link for download as fallback
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentEvent.title.replace(/[^a-zA-Z0-9]/g, '_')}-Registration-QR.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      alert('QR code with event details downloaded. You can now share it manually.');
    }
    
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!currentEvent) {
    return <div className={styles.error}>Event not found</div>;
  }

  return (
    <div className={styles.container}>
      {/* Event Header with Logo */}
      <div className={styles.eventHeader}>
        <div className={styles.headerContent}>
          <div className={styles.logoSection}>
            {currentEvent.logoUrl && (
              <img 
                src={`https://hohobackend.onrender.com${currentEvent.logoUrl}`} 
                alt={`${currentEvent.title} logo`} 
                className={styles.eventLogo}
                onError={e => e.target.style.display = 'none'}
              />
            )}
          </div>
          <div className={styles.eventInfo}>
            <h1>{currentEvent.title}</h1>
            <div className={styles.eventMeta}>
              <p><strong>Date:</strong> {new Date(currentEvent.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {currentEvent.time}</p>
              <p><strong>Venue:</strong> {currentEvent.venue}</p>
              <p><strong>Capacity:</strong> {currentEvent.capacity} people</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className={styles.eventDescription}>
        <h3>Description</h3>
        <p>{currentEvent.description}</p>
      </div>

      {/* Speakers Section */}
      {currentEvent.speakers && currentEvent.speakers.length > 0 && (
        <div className={styles.speakersSection}>
          <h3>Featured Speakers</h3>
          <div className={styles.speakersGrid}>
            {currentEvent.speakers.map((speaker, index) => (
              <div key={index} className={styles.speakerCard}>
                {speaker.photoUrl ? (
                  <img
                    src={`https://hohoindiabackend.onrender.com${speaker.photoUrl}`}
                    alt={speaker.name}
                    className={styles.speakerPhoto}
                    onError={e => e.target.style.display = 'none'}
                  />
                ) : (
                  <div className={styles.speakerPhotoPlaceholder}>
                    {speaker.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                )}
                <div className={styles.speakerInfo}>
                  <h4>{speaker.name}</h4>
                  <p>{speaker.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR Code Section */}
      <div className={styles.qrSection}>
        <h3>Event Registration QR Code</h3>
        <div className={styles.qrContainer} ref={qrRef}>
          <QRCode 
            value={currentEvent.registrationUrl}
            size={200}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
        <div className={styles.qrActions}>
          <button onClick={handleDownloadQR} className={styles.qrActionBtn}>
            📥 Download QR
          </button>
          <button onClick={handleShareQR} className={styles.qrActionBtn}>
            📤 Share QR
          </button>
        </div>
        <p>Share this QR code for attendee registration</p>
      </div>

      {/* Registrations Table */}
      <div className={styles.registrationsSection}>
        <div className={styles.registrationsHeader}>
          <h3>Registrations ({registrations?.length || 0})</h3>
          {registrations && registrations.length > 0 && (
            <button onClick={handleExport} className={styles.exportBtn}>
              Export to Excel
            </button>
          )}
        </div>
        {registrations && registrations.length > 0 ? (
          <div className={styles.registrationsTable}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  {/* <th>Company</th>
                  <th>Designation</th> */}
                  <th>Registration Date</th> 
                </tr>
              </thead>
              <tbody>
                {registrations.map((registration) => (
                  <tr key={registration._id}>
                    <td>{registration.name}</td>
                    <td>{registration.email}</td>
                    <td>{registration.phone}</td>
                    {/* <td>{registration.company || '-'}</td>
                    <td>{registration.designation}</td> */}
                    <td>{new Date(registration.registrationDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.noRegistrations}>
            <p>No registrations yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
