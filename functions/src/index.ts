import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {setGlobalOptions} from "firebase-functions";
import {
  onDocumentCreated,
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";
import {defineSecret} from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import {Resend} from "resend";

initializeApp();

const db = getFirestore();

setGlobalOptions({
  maxInstances: 10,
});

const resendApiKey = defineSecret("RESEND_API_KEY");

const TRACKING_BASE_URL =
  "https://tooothy-smilehaos.web.app/appointment";

type NotificationSettings = {
  adminEmail: string;
  notifyAdminOnNewAppointment: boolean;
  notifyAdminOnConfirmed: boolean;
  notifyAdminOnCancelled: boolean;
  notifyAdminOnCompleted: boolean;
};

/**
 * Sends an email when a new appointment is created.
 */
export const sendAppointmentRequestEmail =
  onDocumentCreated(
    {
      document: "appointments/{appointmentId}",
      secrets: [resendApiKey],
    },
    async (event) => {
      const snapshot = event.data;

      if (!snapshot) {
        logger.error(
          "Appointment document was not found.",
        );
        return;
      }

      const appointment = snapshot.data();
      const patient = appointment.patient ?? {};

      const email =
        typeof patient.email === "string" ?
          patient.email.trim() :
          "";

      if (!email) {
        logger.error(
          "Appointment has no patient email.",
          {
            appointmentId:
              event.params.appointmentId,
          },
        );

        return;
      }

      const appointmentNumber =
        String(
          appointment.appointmentNumber ?? "",
        );

      const serviceName =
        String(
          appointment.serviceName ?? "",
        );

      const date =
        String(
          appointment.date ?? "",
        );

      const time =
        String(
          appointment.time ?? "",
        );

      const trackingToken =
        String(
          appointment.trackingToken ?? "",
        );

      const trackingUrl =
        `${TRACKING_BASE_URL}/${trackingToken}`;

      const resend =
        new Resend(
          resendApiKey.value(),
        );

      /*
       * -------------------------------------------------------
       * PATIENT EMAIL
       * -------------------------------------------------------
       */

      const {data, error} =
        await resend.emails.send({
          from:
            "SmileHaos Dental Clinic <onboarding@resend.dev>",

          to: [email],

          subject:
            `Appointment Request Received — ${appointmentNumber}`,

          html: buildAppointmentEmail({
            title:
              "Appointment Request Received",

            greeting:
              `Hi ${escapeHtml(
                String(
                  patient.fullName ?? "",
                ),
              )},`,

            message:
              "Your appointment request has been successfully received. " +
              "The clinic will review your request and confirm your schedule.",

            appointmentNumber,
            serviceName,
            date,
            time,

            status: "Pending",

            statusDescription:
              "Waiting for clinic confirmation.",

            trackingUrl,
          }),
        });

      if (error) {
        logger.error(
          "Failed to send appointment request email.",
          {
            error,
            appointmentId:
              event.params.appointmentId,
          },
        );

        throw new Error(
          "Appointment request email failed to send.",
        );
      }

      logger.info(
        "Appointment request email sent successfully.",
        {
          emailId: data?.id,
          appointmentId:
            event.params.appointmentId,
        },
      );

      /*
       * -------------------------------------------------------
       * ADMIN EMAIL
       * -------------------------------------------------------
       */

      const notificationSettings =
        await getNotificationSettings();

      if (
        notificationSettings.notifyAdminOnNewAppointment &&
        notificationSettings.adminEmail
      ) {
        await sendAdminAppointmentEmail({
          resend,
          adminEmail:
            notificationSettings.adminEmail,

          title:
            "New Appointment Request",

          message:
            "A new appointment request has been submitted.",

          appointmentNumber,
          patientName:
            String(
              patient.fullName ?? "",
            ),

          patientPhone:
            String(
              patient.phone ?? "",
            ),

          patientEmail:
            String(
              patient.email ?? "",
            ),

          serviceName,
          date,
          time,

          notes:
            String(
              patient.notes ?? "",
            ),

          status: "Pending",
          trackingUrl,
        });
      }
    },
  );

/**
 * Sends an email when an appointment status changes.
 */
export const sendAppointmentStatusEmail =
  onDocumentUpdated(
    {
      document: "appointments/{appointmentId}",
      secrets: [resendApiKey],
    },
    async (event) => {
      const beforeSnapshot =
        event.data?.before;

      const afterSnapshot =
        event.data?.after;

      if (
        !beforeSnapshot ||
        !afterSnapshot
      ) {
        logger.error(
          "Appointment snapshots were not found.",
        );
        return;
      }

      const before =
        beforeSnapshot.data();

      const after =
        afterSnapshot.data();

      const previousStatus =
        String(
          before.status ?? "",
        );

      const newStatus =
        String(
          after.status ?? "",
        );

      if (
        previousStatus === newStatus
      ) {
        return;
      }

      const allowedStatuses = [
        "confirmed",
        "cancelled",
        "completed",
      ];

      if (
        !allowedStatuses.includes(
          newStatus,
        )
      ) {
        return;
      }

      const patient =
        after.patient ?? {};

      const email =
        typeof patient.email === "string" ?
          patient.email.trim() :
          "";

      if (!email) {
        logger.error(
          "Updated appointment has no patient email.",
          {
            appointmentId:
              event.params.appointmentId,
          },
        );

        return;
      }

      const appointmentNumber =
        String(
          after.appointmentNumber ?? "",
        );

      const serviceName =
        String(
          after.serviceName ?? "",
        );

      const date =
        String(
          after.date ?? "",
        );

      const time =
        String(
          after.time ?? "",
        );

      const trackingToken =
        String(
          after.trackingToken ?? "",
        );

      const cancellationReason =
        String(
          after.cancellationReason ?? "",
        );

      const trackingUrl =
        `${TRACKING_BASE_URL}/${trackingToken}`;

      const emailContent =
        getStatusEmailContent({
          status: newStatus,
          patientName:
            String(
              patient.fullName ?? "",
            ),
          cancellationReason,
        });

      const resend =
        new Resend(
          resendApiKey.value(),
        );

      /*
       * -------------------------------------------------------
       * PATIENT STATUS EMAIL
       * -------------------------------------------------------
       */

      const {data, error} =
        await resend.emails.send({
          from:
            "SmileHaos Dental Clinic <onboarding@resend.dev>",

          to: [email],

          subject:
            `${emailContent.subject} — ${appointmentNumber}`,

          html: buildAppointmentEmail({
            title:
              emailContent.title,

            greeting:
              `Hi ${escapeHtml(
                String(
                  patient.fullName ?? "",
                ),
              )},`,

            message:
              emailContent.message,

            appointmentNumber,
            serviceName,
            date,
            time,

            status:
              emailContent.statusLabel,

            statusDescription:
              emailContent.statusDescription,

            trackingUrl,
          }),
        });

      if (error) {
        logger.error(
          "Failed to send appointment status email.",
          {
            error,
            appointmentId:
              event.params.appointmentId,
            previousStatus,
            newStatus,
          },
        );

        throw new Error(
          "Appointment status email failed to send.",
        );
      }

      logger.info(
        "Appointment status email sent successfully.",
        {
          emailId: data?.id,
          appointmentId:
            event.params.appointmentId,
          previousStatus,
          newStatus,
        },
      );

      /*
       * -------------------------------------------------------
       * ADMIN STATUS EMAIL
       * -------------------------------------------------------
       */

      const notificationSettings =
        await getNotificationSettings();

      const shouldNotifyAdmin =
        newStatus === "confirmed" ?
          notificationSettings
            .notifyAdminOnConfirmed :
          newStatus === "cancelled" ?
            notificationSettings
              .notifyAdminOnCancelled :
            newStatus === "completed" ?
              notificationSettings
                .notifyAdminOnCompleted :
              false;

      if (
        shouldNotifyAdmin &&
        notificationSettings.adminEmail
      ) {
        await sendAdminAppointmentEmail({
          resend,
          adminEmail:
            notificationSettings.adminEmail,

          title:
            `Appointment ${emailContent.statusLabel}`,

          message:
            emailContent.message,

          appointmentNumber,

          patientName:
            String(
              patient.fullName ?? "",
            ),

          patientPhone:
            String(
              patient.phone ?? "",
            ),

          patientEmail:
            String(
              patient.email ?? "",
            ),

          serviceName,
          date,
          time,

          notes:
            String(
              patient.notes ?? "",
            ),

          status:
            emailContent.statusLabel,

          cancellationReason,

          trackingUrl,
        });
      }
    },
  );

/**
 * Gets the clinic notification settings.
 *
 * @return {Promise<NotificationSettings>}
 * Notification settings.
 */
async function getNotificationSettings():
  Promise<NotificationSettings> {
  const snapshot =
    await db
      .collection("clinic_settings")
      .doc("notifications")
      .get();

  if (!snapshot.exists) {
    return {
      adminEmail: "",
      notifyAdminOnNewAppointment: true,
      notifyAdminOnConfirmed: false,
      notifyAdminOnCancelled: false,
      notifyAdminOnCompleted: false,
    };
  }

  const data =
    snapshot.data() ?? {};

  return {
    adminEmail:
      typeof data.adminEmail === "string" ?
        data.adminEmail.trim() :
        "",

    notifyAdminOnNewAppointment:
      data.notifyAdminOnNewAppointment !== false,

    notifyAdminOnConfirmed:
      data.notifyAdminOnConfirmed === true,

    notifyAdminOnCancelled:
      data.notifyAdminOnCancelled === true,

    notifyAdminOnCompleted:
      data.notifyAdminOnCompleted === true,
  };
}

/**
 * Sends an admin notification email.
 *
 * Admin email failures are logged but do not throw,
 * preventing a successful patient email from being
 * resent because of a trigger retry.
 *
 * @param {object} options Admin email options.
 * @return {Promise<void>}
 */
async function sendAdminAppointmentEmail(
  options: {
    resend: Resend;
    adminEmail: string;
    title: string;
    message: string;
    appointmentNumber: string;
    patientName: string;
    patientPhone: string;
    patientEmail: string;
    serviceName: string;
    date: string;
    time: string;
    notes: string;
    status: string;
    trackingUrl: string;
    cancellationReason?: string;
  },
): Promise<void> {
  const {
    resend,
    adminEmail,
    title,
    message,
    appointmentNumber,
    patientName,
    patientPhone,
    patientEmail,
    serviceName,
    date,
    time,
    notes,
    status,
    trackingUrl,
    cancellationReason,
  } = options;

  const {
    data,
    error,
  } = await resend.emails.send({
    from:
      "SmileHaos Dental Clinic <onboarding@resend.dev>",

    to: [adminEmail],

    subject:
      `Appointment ${status} — ${appointmentNumber}`,

    html:
      buildAdminAppointmentEmail({
        title,
        message,
        appointmentNumber,
        patientName,
        patientPhone,
        patientEmail,
        serviceName,
        date,
        time,
        notes,
        status,
        trackingUrl,
        cancellationReason:
          cancellationReason ?? "",
      }),
  });

  if (error) {
    logger.error(
      "Failed to send admin appointment email.",
      {
        error,
        adminEmail,
        appointmentNumber,
        status,
      },
    );

    return;
  }

  logger.info(
    "Admin appointment email sent successfully.",
    {
      emailId: data?.id,
      adminEmail,
      appointmentNumber,
      status,
    },
  );
}

/**
 * Builds the admin appointment email HTML.
 *
 * @param {object} options Admin email options.
 * @return {string} Admin email HTML.
 */
function buildAdminAppointmentEmail(
  options: {
    title: string;
    message: string;
    appointmentNumber: string;
    patientName: string;
    patientPhone: string;
    patientEmail: string;
    serviceName: string;
    date: string;
    time: string;
    notes: string;
    status: string;
    trackingUrl: string;
    cancellationReason: string;
  },
): string {
  return `
    <div
      style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        color: #3E3A39;
      "
    >

      <h1 style="color: #3E3A39;">
        SmileHaos Dental Clinic
      </h1>

      <h2>
        ${escapeHtml(options.title)}
      </h2>

      <p>
        ${escapeHtml(options.message)}
      </p>

      <div
        style="
          background: #FAF8F5;
          padding: 24px;
          border-radius: 12px;
          margin: 24px 0;
        "
      >

        <p>
          <strong>
            Appointment Reference
          </strong>
        </p>

        <p
          style="
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 1px;
          "
        >
          ${escapeHtml(
    options.appointmentNumber,
  )}
        </p>

        <p>
          <strong>Status:</strong>
          ${escapeHtml(options.status)}
        </p>

        <p>
          <strong>Service:</strong>
          ${escapeHtml(options.serviceName)}
        </p>

        <p>
          <strong>Date:</strong>
          ${escapeHtml(options.date)}
        </p>

        <p>
          <strong>Time:</strong>
          ${escapeHtml(options.time)}
        </p>

      </div>

      <div
        style="
          background: #FFFFFF;
          border: 1px solid #E3DED8;
          padding: 24px;
          border-radius: 12px;
        "
      >

        <h3>
          Patient Information
        </h3>

        <p>
          <strong>Name:</strong>
          ${escapeHtml(options.patientName)}
        </p>

        <p>
          <strong>Phone:</strong>
          ${escapeHtml(options.patientPhone)}
        </p>

        <p>
          <strong>Email:</strong>
          ${escapeHtml(options.patientEmail)}
        </p>

        ${
  options.notes ?
    `
              <p>
                <strong>Notes:</strong>
                ${escapeHtml(options.notes)}
              </p>
            ` :
    ""
}

        ${
  options.cancellationReason ?
    `
              <p>
                <strong>Cancellation Reason:</strong>
                ${escapeHtml(
    options.cancellationReason,
  )}
              </p>
            ` :
    ""
}

      </div>

      <p style="text-align: center;">
        <a
          href="${escapeHtml(
    options.trackingUrl,
  )}"
          style="
            display: inline-block;
            background: #C3A17B;
            color: white;
            padding: 14px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
          "
        >
          View Appointment
        </a>
      </p>

      <p
        style="
          color: #777;
          font-size: 12px;
          margin-top: 32px;
        "
      >
        Powered by Tooothy
      </p>

    </div>
  `;
}

/**
 * Returns the email content for an appointment status.
 *
 * @param {object} options Status email options.
 * @return {object} Status email content.
 */
function getStatusEmailContent(
  options: {
    status: string;
    patientName: string;
    cancellationReason: string;
  },
): {
  subject: string;
  title: string;
  message: string;
  statusLabel: string;
  statusDescription: string;
} {
  switch (options.status) {
  case "confirmed":
    return {
      subject:
        "Your Appointment Has Been Confirmed",

      title:
        "Appointment Confirmed",

      message:
        "Great news! Your appointment has been confirmed " +
        "by SmileHaos Dental Clinic.",

      statusLabel:
        "Confirmed",

      statusDescription:
        "Your appointment is confirmed and scheduled.",
    };

  case "cancelled":
    return {
      subject:
        "Appointment Cancelled",

      title:
        "Appointment Cancelled",

      message:
        options.cancellationReason ?
          "Your appointment has been cancelled by " +
          "SmileHaos Dental Clinic. Reason: " +
          `${options.cancellationReason}` :
          "Your appointment has been cancelled by " +
          "SmileHaos Dental Clinic.",

      statusLabel:
        "Cancelled",

      statusDescription:
        "This appointment is no longer scheduled.",
    };

  case "completed":
    return {
      subject:
        "Appointment Completed",

      title:
        "Appointment Completed",

      message:
        "Thank you for visiting SmileHaos Dental Clinic. " +
        "Your appointment has been marked as completed.",

      statusLabel:
        "Completed",

      statusDescription:
        "This appointment has been completed.",
    };

  default:
    return {
      subject:
        "Appointment Status Updated",

      title:
        "Appointment Status Updated",

      message:
        "Your appointment status has been updated.",

      statusLabel:
        "Updated",

      statusDescription:
        "Your appointment information has been updated.",
    };
  }
}

/**
 * Builds the appointment email HTML.
 *
 * @param {object} options Email options.
 * @return {string} Email HTML.
 */
function buildAppointmentEmail(
  options: {
    title: string;
    greeting: string;
    message: string;
    appointmentNumber: string;
    serviceName: string;
    date: string;
    time: string;
    status: string;
    statusDescription: string;
    trackingUrl: string;
  },
): string {
  return `
    <div
      style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        color: #3E3A39;
      "
    >

      <h1 style="color: #3E3A39;">
        SmileHaos Dental Clinic
      </h1>

      <p>
        ${options.greeting}
      </p>

      <p>
        ${escapeHtml(options.message)}
      </p>

      <div
        style="
          background: #FAF8F5;
          padding: 24px;
          border-radius: 12px;
          margin: 24px 0;
        "
      >

        <p>
          <strong>
            Appointment Reference
          </strong>
        </p>

        <p
          style="
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 1px;
          "
        >
          ${escapeHtml(
    options.appointmentNumber,
  )}
        </p>

        <p>
          <strong>Service:</strong>
          ${escapeHtml(
    options.serviceName,
  )}
        </p>

        <p>
          <strong>Date:</strong>
          ${escapeHtml(options.date)}
        </p>

        <p>
          <strong>Time:</strong>
          ${escapeHtml(options.time)}
        </p>

        <p>
          <strong>Status:</strong>
          ${escapeHtml(options.status)}
        </p>

      </div>

      <p>
        ${escapeHtml(
    options.statusDescription,
  )}
      </p>

      <p style="text-align: center;">
        <a
          href="${escapeHtml(
    options.trackingUrl,
  )}"
          style="
            display: inline-block;
            background: #C3A17B;
            color: white;
            padding: 14px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
          "
        >
          View Appointment Status
        </a>
      </p>

      <p
        style="
          color: #777;
          font-size: 12px;
          margin-top: 32px;
        "
      >
        Please keep this email for your
        appointment reference.
      </p>

      <p
        style="
          color: #777;
          font-size: 12px;
        "
      >
        Powered by Tooothy
      </p>

    </div>
  `;
}

/**
 * Escapes HTML-sensitive characters.
 *
 * @param {string} value The value to escape.
 * @return {string} The escaped value.
 */
function escapeHtml(
  value: string,
): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
