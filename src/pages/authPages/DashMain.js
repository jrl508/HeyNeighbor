import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Icon from "@mdi/react";
import { 
  mdiMessageText, 
  mdiChevronRight, 
  mdiTools, 
  mdiStorefront, 
  mdiCalendarMonth,
  mdiMagnify,
  mdiPlus,
  mdiBellOutline,
  mdiStar,
  mdiPackageVariant,
  mdiHeartOutline
} from "@mdi/js";
import styles from "../../styles/Dashboard.module.css";
import { bookingsAPI, paymentsAPI, toolsAPI } from "../../api";
import { sendMessage } from "../../api/messaging";
import ReviewModal from "../../components/ReviewModal";
import RescheduleModal from "../../components/RescheduleModal";
import { useAuth } from "../../hooks/useAuth";
import { useBookings } from "../../contexts/BookingContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { formatDisplayDate } from "../../util/dateUtils";
import { capitalize } from "../../util/UtilFunctions";
import Avatar from "../../components/Avatar";

const DashMain = () => {
  const { state } = useAuth();
  const { user } = state;
  const navigate = useNavigate();
  const { state: bookingState, fetchBookings } = useBookings();
  const { notifications, markAsRead } = useNotifications();
  const bookings = bookingState.bookings;
  const loading = bookingState.loading;
  
  const [recommendedTools, setRecommendedTools] = useState([]);
  const [messageLoading, setMessageLoading] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingBookingId, setReviewingBookingId] = useState(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [reschedulingBooking, setReschedulingBooking] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Mock recommended tools since backend doesn't have it yet
    setRecommendedTools([
      { id: 1, name: "DeWalt Drill", price: 15, rating: 4.8, reviews: 12, distance: "1.1 mi", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&auto=format" },
      { id: 2, name: "Pressure Washer", price: 25, rating: 4.6, reviews: 8, distance: "1.6 mi", image: "https://images.unsplash.com/photo-1581141849291-1125c7b692b5?w=400&auto=format" },
      { id: 3, name: "Circular Saw", price: 12, rating: 4.7, reviews: 15, distance: "2.0 mi", image: "https://images.unsplash.com/photo-1530124560676-4cc663004381?w=400&auto=format" },
      { id: 4, name: "Extension Ladder", price: 10, rating: 4.9, reviews: 9, distance: "2.3 mi", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&auto=format" }
    ]);
  }, []);

  const refreshData = () => {
    if (token) {
      fetchBookings(token);
    }
  };

  const ongoingBookings = bookings.filter(b => !["completed", "cancelled"].includes(b.status));
  const myRentals = ongoingBookings.filter(b => b.renter_id === user?.id);
  const myToolsRented = ongoingBookings.filter(b => b.owner_id === user?.id);

  const StatCard = ({ icon, label, value, colorClass, link, linkText }) => (
    <div className={styles.statCard}>
      <div className={`${styles.statIconWrapper} ${colorClass}`}>
        <Icon path={icon} size={1.2} />
      </div>
      <div className={styles.statInfo}>
        <h3>{value}</h3>
        <p>{label}</p>
        <Link to={link} className={styles.statLink}>
          {linkText} <Icon path={mdiChevronRight} size={0.6} />
        </Link>
      </div>
    </div>
  );

  const ActionCard = ({ icon, title, subtitle, onClick }) => (
    <div className={styles.actionCard} onClick={onClick}>
      <Icon path={icon} size={1.5} className={styles.actionIcon} />
      <h4>{title}</h4>
      <p>{subtitle}</p>
    </div>
  );

  return (
    <div className={styles.dashboardContainer}>
      {/* Welcome Header */}
      <div className={styles.welcomeHeader}>
        <h1 className={styles.welcomeTitle}>Welcome back, {user?.first_name || "Neighbor"}! 👋</h1>
        <p className={styles.welcomeSubtitle}>Here's what's happening in your neighborhood.</p>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <StatCard 
          icon={mdiTools} 
          value="42" 
          label="Tools available near you" 
          colorClass={styles.iconTools}
          link="/dashboard/listings"
          linkText="Browse listings"
        />
        <StatCard 
          icon={mdiStorefront} 
          value="18" 
          label="Local businesses nearby" 
          colorClass={styles.iconBiz}
          link="/dashboard/local-biz"
          linkText="View businesses"
        />
        <StatCard 
          icon={mdiCalendarMonth} 
          value={myRentals.length + myToolsRented.length} 
          label="Active rentals" 
          colorClass={styles.iconRentals}
          link="/dashboard"
          linkText="View rentals"
        />
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.mainColumn}>
          {/* Quick Actions */}
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          <div className={styles.quickActions}>
            <ActionCard 
              icon={mdiMagnify} 
              title="Browse Listings" 
              subtitle="Find tools nearby" 
              onClick={() => navigate("/dashboard/listings")}
            />
            <ActionCard 
              icon={mdiPlus} 
              title="Add a Tool" 
              subtitle="List your tool" 
              onClick={() => navigate("/dashboard/toolshed")}
            />
            <ActionCard 
              icon={mdiStorefront} 
              title="Post a Business" 
              subtitle="Share with neighbors" 
              onClick={() => navigate("/dashboard/local-biz")}
            />
            <ActionCard 
              icon={mdiBellOutline} 
              title="Request a Tool" 
              subtitle="Can't find it? Let neighbors know" 
              onClick={() => {}}
            />
          </div>

          {/* Listings Grid */}
          <div className={styles.rentalListingsGrid}>
            <div className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <h3>
                  <Icon path={mdiPackageVariant} size={0.8} color="#f97316" />
                  My Rentals <span className="has-text-grey-light is-size-7">(Renting from others)</span>
                </h3>
                <Icon path={mdiChevronRight} size={0.8} />
              </div>
              {myRentals.length === 0 ? (
                <div className={styles.emptyState}>
                  <Icon path={mdiPackageVariant} size={2} className={styles.emptyIcon} />
                  <div className={styles.emptyContent}>
                    <p className={styles.emptyText}>You haven't rented any tools yet.</p>
                    <button className={styles.browseBtn} onClick={() => navigate("/dashboard/listings")}>
                      Browse listings
                    </button>
                  </div>
                </div>
              ) : (
                <ul className={styles.activeBookingsList}>
                  {myRentals.map(b => (
                    <li key={b.id} className={styles.bookingItem}>
                      <strong>{b.tool_name}</strong>
                      <span className="is-size-7 has-text-grey ml-2">{formatDisplayDate(b.end_date)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <h3>
                  <Icon path={mdiTools} size={0.8} color="#22c55e" />
                  My Listings <span className="has-text-grey-light is-size-7">(Rented by others)</span>
                </h3>
                <Icon path={mdiChevronRight} size={0.8} />
              </div>
              {myToolsRented.length === 0 ? (
                <div className={styles.emptyState}>
                  <Icon path={mdiTools} size={2} className={styles.emptyIcon} />
                  <div className={styles.emptyContent}>
                    <p className={styles.emptyText}>None of your tools are currently rented.</p>
                    <button className={styles.browseBtn} style={{ color: "#22c55e" }} onClick={() => navigate("/dashboard/toolshed")}>
                      Go to Toolshed
                    </button>
                  </div>
                </div>
              ) : (
                <ul className={styles.activeBookingsList}>
                  {myToolsRented.map(b => (
                    <li key={b.id} className={styles.bookingItem}>
                      <strong>{b.tool_name}</strong>
                      <span className="is-size-7 has-text-grey ml-2">{formatDisplayDate(b.end_date)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Recommended Nearby Tools */}
          <div className={`${styles.recommendedSection} is-hidden-mobile`}>
            <div className={styles.cardHeader}>
              <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Recommended Nearby Tools</h2>
              <Link to="/dashboard/listings" className={styles.viewAllLink}>View all listings</Link>
            </div>
            <div className={styles.toolsCarousel}>
              {recommendedTools.map(tool => (
                <div key={tool.id} className={styles.miniToolCard}>
                  <button className={styles.favoriteBtn}>
                    <Icon path={mdiHeartOutline} size={0.6} />
                  </button>
                  <img src={tool.image} alt={tool.name} className={styles.toolImage} />
                  <div className={styles.toolInfo}>
                    <h5 className={styles.toolName}>{tool.name}</h5>
                    <p className={styles.toolPrice}>${tool.price} / day</p>
                    <div className="is-flex is-align-items-center mt-1">
                      <span className="is-size-7 has-text-grey">{tool.distance} away</span>
                      <div className="ml-auto is-flex is-align-items-center">
                        <Icon path={mdiStar} size={0.5} color="#fbbf24" />
                        <span className="is-size-7 ml-1">{tool.rating} ({tool.reviews})</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panels */}
        <div className={styles.sidePanel}>
          <div className={`${styles.contentCard} is-hidden-mobile`}>
            <div className={styles.cardHeader}>
              <h3 className="is-size-6">Neighborhood Activity</h3>
              <Link to="#" className={styles.viewAllLink}>View all</Link>
            </div>
            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  <Avatar size="sm" />
                </div>
                <div className={styles.activityContent}>
                  <p><strong>Mike</strong> requested your DeWalt Drill</p>
                  <span className={styles.activityTime}>2h ago</span>
                </div>
              </div>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  <Icon path={mdiStar} size={0.6} color="#fbbf24" />
                </div>
                <div className={styles.activityContent}>
                  <p><strong>Sarah</strong> rated your listing</p>
                  <span className={styles.activityTime}>4h ago</span>
                </div>
              </div>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  <Icon path={mdiStorefront} size={0.6} color="#22c55e" />
                </div>
                <div className={styles.activityContent}>
                  <p>New business added: <strong>Taunton Hardware</strong></p>
                  <span className={styles.activityTime}>6h ago</span>
                </div>
              </div>
            </div>
            <div className="has-text-centered mt-4">
              <Link to="#" className={styles.viewAllLink}>See more activity <Icon path={mdiChevronRight} size={0.5} /></Link>
            </div>
          </div>

          <div className={styles.contentCard}>
            <div className={styles.cardHeader}>
              <h3 className="is-size-6">Neighborhood Requests</h3>
              <Link to="#" className={styles.viewAllLink}>View all</Link>
            </div>
            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon} style={{ background: "#f3f4f6", width: "48px", height: "48px", borderRadius: "12px" }}>
                  <Icon path={mdiTools} size={1} />
                </div>
                <div className={styles.activityContent} style={{ flex: 1 }}>
                  <div className="is-flex is-justify-content-space-between is-align-items-center">
                    <div>
                      <p><strong>Post Hole Digger</strong></p>
                      <p className="is-size-7 has-text-grey">Needed by May 30</p>
                      <p className="is-size-7 has-text-grey">1.2 mi away</p>
                    </div>
                    <span className={styles.tagOrange}>NEW</span>
                  </div>
                </div>
              </div>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon} style={{ background: "#f3f4f6", width: "48px", height: "48px", borderRadius: "12px" }}>
                  <Icon path={mdiTools} size={1} />
                </div>
                <div className={styles.activityContent} style={{ flex: 1 }}>
                  <p><strong>Concrete Mixer</strong></p>
                  <p className="is-size-7 has-text-grey">Needed by Jun 2</p>
                  <p className="is-size-7 has-text-grey">2.1 mi away</p>
                </div>
              </div>
            </div>
            <div className="has-text-centered mt-4 is-hidden-mobile">
              <Link to="#" className={styles.viewAllLink}>See all requests <Icon path={mdiChevronRight} size={0.5} /></Link>
            </div>
          </div>
        </div>
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        bookingId={reviewingBookingId}
        onReviewSubmitted={refreshData}
      />
      {isRescheduleModalOpen && reschedulingBooking && (
        <RescheduleModal
          isOpen={isRescheduleModalOpen}
          booking={reschedulingBooking}
          onClose={() => setIsRescheduleModalOpen(false)}
          onSuccess={refreshData}
        />
      )}
    </div>
  );
};

export default DashMain;
