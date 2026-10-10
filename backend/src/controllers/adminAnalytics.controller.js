import { prisma } from "../lib/prisma.js";

/*
|--------------------------------------------------------------------------
| ADMIN ANALYTICS
|--------------------------------------------------------------------------
*/

export const getAdminAnalytics =
  async (req, res) => {
    try {
      /*
      |--------------------------------------------------------------------------
      | BASIC COUNTS
      |--------------------------------------------------------------------------
      */

      const [
        totalUsers,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
      ] = await Promise.all([
        prisma.user.count({
          where: {
            role: "USER",
          },
        }),

        prisma.booking.count(),

        prisma.booking.count({
          where: {
            status: "PENDING",
          },
        }),

        prisma.booking.count({
          where: {
            status: "CONFIRMED",
          },
        }),

        prisma.booking.count({
          where: {
            status: "COMPLETED",
          },
        }),

        prisma.booking.count({
          where: {
            status: "CANCELLED",
          },
        }),
      ]);

      /*
      |--------------------------------------------------------------------------
      | PAID NON-CANCELLED BOOKINGS
      |--------------------------------------------------------------------------
      |
      | Cancelled bookings are excluded from
      | dashboard revenue.
      |
      */

      const paidBookings =
        await prisma.booking.findMany({
          where: {
            paymentStatus: "PAID",

            status: {
              not: "CANCELLED",
            },
          },

          select: {
            pricePaise: true,

            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });

      /*
      |--------------------------------------------------------------------------
      | TOTAL REVENUE
      |--------------------------------------------------------------------------
      */

      const totalRevenuePaise =
        paidBookings.reduce(
          (total, booking) =>
            total +
            booking.pricePaise,
          0
        );

      /*
      |--------------------------------------------------------------------------
      | CALCULATE CUSTOMER SPENDING
      |--------------------------------------------------------------------------
      */

      const customerSpending =
        new Map();

      paidBookings.forEach(
        (booking) => {
          const userId =
            booking.user.id;

          if (
            !customerSpending.has(
              userId
            )
          ) {
            customerSpending.set(
              userId,
              {
                id:
                  booking.user.id,

                name:
                  booking.user.name,

                email:
                  booking.user.email,

                totalSpentPaise: 0,

                paidBookings: 0,
              }
            );
          }

          const customer =
            customerSpending.get(
              userId
            );

          customer.totalSpentPaise +=
            booking.pricePaise;

          customer.paidBookings += 1;
        }
      );

      /*
      |--------------------------------------------------------------------------
      | HIGHEST-SPENDING CUSTOMER
      |--------------------------------------------------------------------------
      */

      const customers =
        Array.from(
          customerSpending.values()
        );

      customers.sort(
        (a, b) =>
          b.totalSpentPaise -
          a.totalSpentPaise
      );

      const topCustomer =
        customers.length > 0
          ? {
              id:
                customers[0].id,

              name:
                customers[0].name,

              email:
                customers[0].email,

              paidBookings:
                customers[0]
                  .paidBookings,

              totalSpentRupees:
                customers[0]
                  .totalSpentPaise /
                100,
            }
          : null;

      /*
      |--------------------------------------------------------------------------
      | RESPONSE
      |--------------------------------------------------------------------------
      */

      return res.status(200).json({
        success: true,

        analytics: {
          totalUsers,

          totalBookings,

          pendingBookings,

          confirmedBookings,

          completedBookings,

          cancelledBookings,

          totalRevenueRupees:
            totalRevenuePaise /
            100,

          topCustomer,
        },
      });
    } catch (error) {
      console.error(
        "Admin analytics error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load analytics",
      });
    }
  };