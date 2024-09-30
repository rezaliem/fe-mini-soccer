import { defineStore } from "pinia";
import { h, Component } from "vue";
import { NButton, NIcon, NSpace } from "naive-ui";

// Types
import { Menu } from "~/types/layout";

// Composable

// Icons
import AuditOutlinedIcon from "~icons/ant-design/audit-outlined";
import BuildOutlineIcon from "~icons/ion/build-outline";
import BusinessOutlineIcon from "~icons/ion/business-outline";
import CogOutlineIcon from "~icons/ion/cog-outline";
import FileTrayFullOutlineIcon from "~icons/ion/file-tray-full-outline";
import HomeOutlineIcon from "~icons/ion/home-outline";
import PeopleOutlineIcon from "~icons/ion/people-outline";
import PlusIcon from "~icons/ion/plus";
import ReceiptOutlineIcon from "~icons/ion/receipt-outline";
import SettingsOutlineIcon from "~icons/ion/settings-outline";
import SwapHorizontalOutlineIcon from "~icons/ion/swap-horizontal-outline";

export const useMenuStore = defineStore("menu", {
  state: () => {
    return {
      sidebarMenu: [<Menu>{}],
    };
  },

  actions: {
    renderIcon(icon: Component) {
      return () => h(NIcon, null, { default: () => h(icon) });
    },

    async setSidebarMenu() {
      const NuxtLink = defineNuxtLink({});
      const userType = useCookie("user.type");
      if (userType.value !== "scoringEngine")
        this.sidebarMenu = [
          {
            label: () =>
              h(
                NuxtLink,
                {
                  to: "/dashboard",
                },
                () => "Dashboard"
              ),
            key: "header-dashboard",
            icon: this.renderIcon(HomeOutlineIcon),
            path: "/dashboard",
          },
          {
            label: "Applications",
            key: "header-application",
            icon: this.renderIcon(FileTrayFullOutlineIcon),
            path: "/application",
            children: [
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/application/sg-application",
                    },
                    () => "BA Application"
                  ),
                key: `a-SG_APPLICATION`,
                path: "/application/sg-application",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/application/sg-cashline-application",
                    },
                    () => "Cashline Application"
                  ),
                key: `a-SG_CASHLINE_APPLICATION`,
                path: "/application/sg-cashline-application",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/application/term-loan",
                    },
                    () => "Term Loan Application"
                  ),
                key: `a-TERM_LOAN`,
                path: "/application/term-loan",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/application/withdrawal",
                    },
                    () => "Withdrawal Request"
                  ),
                key: `a-WITHDRAWAL_REQUEST`,
                path: "/application/withdrawal",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/application/paylater",
                    },
                    () => "PayLater Application"
                  ),
                key: `a-PAYLATER_APPLICATION`,
                path: "/application/paylater",
              },

              /*
               * the rest is from BE, handler below
               */
            ],
          },
          {
            label: "Client Management",
            key: "header-clientManagement",
            icon: this.renderIcon(BusinessOutlineIcon),
            path: "/client-management",
            children: [
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/client-management/business",
                    },
                    () => "Business"
                  ),
                key: "cm-business",
                path: "/client-management/business",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/client-management/user",
                    },
                    () => "User"
                  ),
                key: "cm-user",
                path: "/client-management/user",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/client-management/userNetwork",
                    },
                    () => "Network"
                  ),
                key: "cm-network",
                path: "/client-management/userNetwork",
              },
            ],
          },
          {
            label: "Transaction History",
            key: "header-transactionHistory",
            icon: this.renderIcon(ReceiptOutlineIcon),
            path: "/transaction-history",
            children: [
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/transaction-history/master",
                    },
                    () => "INFT Transaction Master"
                  ),
                key: "th-master",
                path: "/transaction-history/master",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/transaction-history/transaction-vendor",
                    },
                    () => "Vendor"
                  ),
                key: "th-vendor",
                path: "/transaction-history/transaction-vendor",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/transaction-history/request",
                    },
                    () => "Request"
                  ),
                key: "th-request",
                path: "/transaction-history/request",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/transaction-history/tazapay-top-up-history",
                    },
                    () => "Tazapay History"
                  ),
                key: "th-tazapayTopUpHistory",
                path: "/transaction-history/tazapay-top-up-history",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/transaction-history/emq",
                    },
                    () => "EMQ History"
                  ),
                key: "th-emqHistory",
                path: "/transaction-history/emq",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/transaction-history/liquid-pay",
                    },
                    () => "Liquid Pay History"
                  ),
                key: "th-liquidPay",
                path: "/transaction-history/liquid-pay",
              },
            ],
          },
          {
            label: "Remittance Management",
            key: "header-remittanceManagement",
            icon: this.renderIcon(SwapHorizontalOutlineIcon),
            path: "/remittance",
            children: [
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/remittance/beneficiary",
                    },
                    () => "Beneficiary"
                  ),
                key: "remit-beneficiary",
                path: "/remittance/beneficiary",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/remittance/transaction-fee",
                    },
                    () => "Transaction Fee"
                  ),
                key: "remit-transaction-fee",
                path: "/remittance/transaction-fee",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/remittance/rails-management",
                    },
                    () => "Rails Management"
                  ),
                key: "rails-management",
                path: "/remittance/rails-management",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/tools/collection-account",
                    },
                    () => "Collection Account"
                  ),
                key: "t-collectionAccount",
                path: "/tools/collection-account",
              },
            ],
          },
          {
            label: "Tools",
            key: "header-tools",
            icon: this.renderIcon(BuildOutlineIcon),
            path: "/tools",
            children: [
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/client-management/announcements",
                    },
                    () => "Announcements"
                  ),
                key: "cm-announcements",
                path: "/client-management/announcements",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/tools/apis-and-tasks",
                    },
                    () => "APIs and Tasks"
                  ),
                key: "t-apisAndTasks",
                path: "/tools/apis-and-tasks",
              },
              // {
              //   label: () =>
              //     h(
              //       NuxtLink,
              //       {
              //         to: "/tools/lms-linkage-checker",
              //       },
              //       () => "LMS Linkage Checker"
              //     ),
              //   key: "t-lmsLinkageChecker",
              //   path: "/tools/lms-linkage-checker",
              // },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/tools/rapyd-json-detail",
                    },
                    () => "Rapyd JSON Detail"
                  ),
                key: "t-rapydJsonDetail",
                path: "/tools/rapyd-json-detail",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/transaction-history/transaction-check",
                    },
                    () => "Transaction Check"
                  ),
                key: "th-transactionCheck",
                path: "/transaction-history/transaction-check",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/remittance/regex",
                    },
                    () => "Regex Description"
                  ),
                key: "regex",
                path: "/remittance/regex",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/configuration/otp-generator",
                    },
                    () => "OTP Generator"
                  ),
                key: "t-otpGenerator",
                path: "/configuration/otp-generator",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/configuration/transaction-data-fix",
                    },
                    () => "Transaction Data Fix"
                  ),
                key: "t-transactionDataFix",
                path: "/configuration/transaction-data-fix",
              },
            ],
          },
          {
            label: "Configuration",
            key: "header-configuration",
            icon: this.renderIcon(SettingsOutlineIcon),
            path: "/configuration",
            children: [
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/tools/referral-code",
                    },
                    () => "Referral Code"
                  ),
                key: "t-referralCode",
                path: "/tools/referral-code",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/configuration/ref-data",
                    },
                    () => "Reference Data"
                  ),
                key: "t-referenceData",
                path: "/configuration/ref-data",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/configuration/manage-notification",
                    },
                    () => "Notification Management"
                  ),
                key: "t-manageNotification",
                path: "/configuration/manage-notification",
              },
            ],
          },
          {
            label: "Partners",
            key: "header-partners",
            icon: this.renderIcon(PeopleOutlineIcon),
            path: "/partners",
            children: [
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/partners/manage-open-api",
                    },
                    () => "Manage Open API"
                  ),
                key: "p-manageOpenApi",
                path: "/partners/manage-open-api",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/client-management/accounting-integration",
                    },
                    () => "Accounting Integration"
                  ),
                key: "cm-accounting-integration",
                path: "/client-management/accounting-integration",
              },
            ],
          },
          {
            label: "Admin Management",
            key: "header-adminManagement",
            icon: this.renderIcon(CogOutlineIcon),
            path: "/admin-management",
            children: [
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/admin/user-management",
                    },
                    () => "User Management"
                  ),
                key: "am-manageAdmin",
                path: "/admin/user-management",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/admin/access-control",
                    },
                    () => "Access Control"
                  ),
                key: "am-accessControl",
                path: "/admin/access-control",
              },
            ],
          },
          {
            label: "Audit & Logs",
            key: "header-auditandlogs",
            icon: this.renderIcon(AuditOutlinedIcon),
            path: "/audit",
            children: [
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/audit/general-audit-trail",
                    },
                    () => "General Audit Trail"
                  ),
                key: "am-generalAuditTrail",
                path: "/audit/general-audit-trail",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/tools/sms-notification-log",
                    },
                    () => "SMS Notification Log"
                  ),
                key: "t-smsNotificationLog",
                path: "/tools/sms-notification-log",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/tools/email-notification-log",
                    },
                    () => "Email Notification Log"
                  ),
                key: "t-emailNotificationLog",
                path: "/tools/email-notification-log",
              },
            ],
          },
        ];
      else
        this.sidebarMenu = [
          {
            label: () =>
              h(
                NuxtLink,
                {
                  to: "/dashboard",
                },
                () => "Dashboard"
              ),
            key: "header-dashboard",
            icon: this.renderIcon(HomeOutlineIcon),
            path: "/dashboard",
          },
          {
            label: "CA Scoring Engine",
            key: "ca-scoring-engine",
            icon: this.renderIcon(FileTrayFullOutlineIcon),
            children: [
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/scoring-engine/ca-application",
                    },
                    () => "CA Application"
                  ),
                key: "ca-application",
                path: "/scoring-engine/ca-application",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/scoring-engine/ca-assessment",
                    },
                    () => "CA Assessment"
                  ),
                key: "ca-assessment",
                path: "/scoring-engine/ca-assessment",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/scoring-engine/score-card",
                    },
                    () => "Score Card Setting"
                  ),
                key: "score-card",
                path: "/scoring-engine/score-card",
              },
            ],
          },
          {
            label: "BNPL Scoring Engine",
            key: "bnpl-scoring-engine",
            icon: this.renderIcon(FileTrayFullOutlineIcon),
            children: [
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/scoring-engine/bnpl/company-list",
                    },
                    () => "Company List"
                  ),
                key: "Company List",
                path: "/scoring-engine/bnpl/company-list",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/scoring-engine/bnpl/score-card",
                    },
                    () => "Score Card"
                  ),
                key: "Score Card",
                path: "/scoring-engine/bnpl/score-card",
              },
            ],
          },
          {
            label: "AGF Scoring Engine",
            key: "agf-scoring-engine",
            icon: this.renderIcon(FileTrayFullOutlineIcon),
            children: [
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/scoring-engine/agf-application",
                    },
                    () => "AGF Application"
                  ),
                key: "agf-application",
                path: "/scoring-engine/agf-application",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/scoring-engine/agf-application/assessment",
                    },
                    () => "AGF Assessment"
                  ),
                key: "agf-assessment",
                path: "/scoring-engine/agf-application/assessment",
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: "/scoring-engine/score-card-agf",
                    },
                    () => "Score Card Setting"
                  ),
                key: "score-card-agf",
                path: "/scoring-engine/score-card-agf",
              },
            ],
          },
        ];

      // Insert application menu

      if (userType.value !== "scoringEngine")
        try {
          const response = await GeneralApplicationService.getApplicationType({
            limit: 10,
            page: 1,
          });

          if (!response) throw Error;

          const mIndex = this.sidebarMenu.findIndex(
            (sm) => sm.label === "Applications"
          );

          // from BE (application type)
          response.getAllApplication.forEach((application) => {
            let routeTo = ``;
            if (application.type === "INFT_APPLICATION") {
              routeTo = `/application/general`;
            } else if (application.type === "RAPYD_APPLICATION") {
              routeTo = `/application/rapyd`;
            } else if (application.type === "TRUFFLE_APPLICATION") {
              routeTo = `/application/truffle`;
            } else if (application.type === "MY_LOAN") {
              routeTo = `/application/my-application`;
            }

            const removeSnakeCase = (s) =>
              s.replace(/^_*(.)|_+(.)/g, (s, c, d) => (c ? c : " " + d));

            const toTitleCase = (str) => {
              return str.replace(/\w\S*/g, function (txt) {
                return (
                  txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                );
              });
            };

            if (routeTo) {
              this.sidebarMenu[mIndex].children.push({
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: routeTo,
                    },
                    () => toTitleCase(removeSnakeCase(application.type))
                  ),
                key: `a-${application.type}`,
                path: routeTo,
              });
            } else {
              this.sidebarMenu[mIndex].children.push({
                disabled: true,
                label: application.type,
              });
            }
          });
          // END from BE (application type)
        } catch (error) {
          Console.debug("get sidebar menu", error, null);
        }
      // END Insert application menu
    },
  },
});
