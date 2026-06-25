// note: Dont change anything from this page [strictly follow the rules].

// API Base URLs from environment variables
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
export const API_AI_BASE_URL = process.env.NEXT_PUBLIC_API_AI_BASE_URL

// API Endpoints
export const endpoints = {
  auth: {
    login: '/api/gen-portal/auth/login', // POST : Gen Portal Login
    logout: '/api/gen-portal/auth/logout', // POST : Gen Portal Logout
    changePassword: '/api/gen-portal/auth/change-password', // POST : Gen Portal Change Password
    refresh: '/api/gen-portal/auth/refresh', // POST : Gen Portal Refresh
  },
  userControl: {
    get: '/api/portal/users',
    getById: ({ userId }: { userId: string }) => `/api/portal/users/${userId}`,
    delete: ({ userId }: { userId: string }) => `/api/portal/users/${userId}`,
    getAll: '/api/portal/users',
    invite: '/api/portal/users/invite',
    updatePermissions: ({ userId }: { userId: string }) =>
      `/api/portal/users/${userId}/permissions`,
    updateSettings: ({ userId }: { userId: string }) =>
      `/api/portal/users/${userId}/settings`,
  },
  recipes: {
    get: '/api/portal/recipes',
    getById: ({ recipeId }: { recipeId: string }) => `/api/recipes/${recipeId}`,
    delete: ({ recipeId }: { recipeId: string }) =>
      `/api/portal/recipes/${recipeId}`, // Changed to portal endpoint for delete
    update: ({ recipeId }: { recipeId: string }) =>
      `/api/portal/recipes/${recipeId}`,
    create: '/api/portal/recipes',
  },
  ingredients: {
    create: '/api/portal/ingredients',
    getById: ({ ingredientId }: { ingredientId: string }) =>
      `/api/portal/ingredients/${ingredientId}`,
    update: ({ ingredientId }: { ingredientId: string }) =>
      `/api/portal/ingredients/${ingredientId}`,
    delete: ({ ingredientId }: { ingredientId: string }) =>
      `/api/portal/ingredients/${ingredientId}`,
    get: '/api/portal/ingredients',
  },
  products: {
    get: '/api/products/list',
    getById: ({ productId }: { productId: string }) =>
      `/api/products/${productId}`,
    create: '/api/portal/products',
    update: ({ productId }: { productId: string }) =>
      `/api/portal/products/${productId}`,
    delete: ({ productId }: { productId: string }) =>
      `/api/portal/products/${productId}`,

  },
  categories: {
    get: '/api/categories',
  },
  packages: {
    get: '/api/portal/packages', // Get all packages including inactive ones
    getById: ({ packageId }: { packageId: string }) =>
      `/api/portal/packages/${packageId}`, // Get package by ID
    create: '/api/portal/packages',
    update: ({ packageId }: { packageId: string }) =>
      `/api/portal/packages/${packageId}`, // Update package
    delete: ({ packageId }: { packageId: string }) =>
      `/api/portal/package/${packageId}`, // Delete package
    deleteVariant: ({
      packageId,
      subPackageId,
    }: {
      packageId: string
      subPackageId: string
    }) => `/api/portal/package/${packageId}/variants/${subPackageId}`,
  },
  orders: {
    get: '/api/portal/orders', // Get all orders with pagination and filtering
    create: '/api/portal/orders', //Create New Order
    getById: ({ orderId }: { orderId: string }) =>
      `/api/portal/orders/${orderId}`, //Get order by ID
    delete: ({ orderId }: { orderId: string }) =>
      `/api/portal/orders/${orderId}`, //Delete Order
    updatePayment: ({ orderId }: { orderId: string }) =>
      `/api/portal/orders/${orderId}/payment`,
    updateShippingAddress: ({ orderId }: { orderId: string }) =>
      `/api/portal/orders/${orderId}/shipping-address`, //Update order shipping address
    updateTimeline: ({ orderId }: { orderId: string }) =>
      `/api/portal/orders/${orderId}/timeline`, //Update order timeline and tracking
  },
  flagController: {
    get: '/api/portal/flags',
    create: '/api/portal/flags',
    getByCategory: ({ category }: { category: string }) =>
      `/api/portal/flags/${category}`,
    update: ({ flagId }: { flagId: string }) => `/api/portal/flags/${flagId}`,
    delete: ({ flagId }: { flagId: string }) => `/api/portal/flags/${flagId}`,
  },
  familyMealPlans: {
    get: ({ customerId }: { customerId: string }) =>
      `/api/portal/family/${customerId}`, // Get Family member details

  },
  ai: {
    nutrition: {
      calculate: '/api/portal/nutrition/calculate',
    },
    mealPlanner: {
      getQuestionsByGroup: '/get-questions-by-group',
      generateMacronutrient: '/generate-macronutrient',
      getRecommendedRecipes: '/recommended-filtered-recipes',
      generateMealPlan: '/meal-plan',
      calculateRecipeNutrition: '/calculate-recipe-nutrition',
    },
    bloodTest: {
      download: ({ clientId }: { clientId: string }) =>
        `/api/client-blood-reports/${clientId}/download`, // Get api : Download Blood Report Pdf
    },
    clients: {
      get: '/api/portal/clients',
      getHealthProfile: ({ clientId }: { clientId: string }) =>
        `/api/portal/clients/${clientId}/health-profile`, // Get Health Profile
      putHealthProfile: ({ clientId }: { clientId: string }) =>
        `/api/portal/clients/${clientId}/health-profile`, // Put Health Profile
      getDetectedConditions: ({ clientId }: { clientId: string }) =>
        `/api/portal/clients/${clientId}/detected-conditions`, // Get Detected Conditions
      saveDetectedConditions: ({ clientId }: { clientId: string }) =>
        `/api/portal/clients/${clientId}/detected-conditions`, // Save Detected Conditions
      uploadBloodReport: `/upload-blood-report`, // POST : Upload Blood Report
      getBloodTestAnalysis: ({ clientId }: { clientId: string }) =>
        `/api/portal/blood-test/${clientId}/analyze`, // Get Blood Test Analysis
      getClientDetails: ({ clientId }: { clientId: string }) =>
        `/api/portal/client/${clientId}/details`, // Get Client Details
      postDetectedConditionsPreview: () =>
        `/api/clients/detected-conditions`, // POST : lsa questions to detection api
      createInitialConsultSummary: ({
        clientId,
        type,
      }: {
        clientId: string
        type: string
      }) => `/api/portal/clients/${clientId}/initial-consult-summary?type=${type}`, // POST : Create Initial Consult Summary
      getInitialConsultSummary: ({ clientId, week, type }: { clientId: string; week?: number; type?: string }) =>
        `/api/portal/clients/${clientId}/initial-consult-summary${week ? `?week=${week}` : ''}${week && type ? `&type=${type}` : type ? `?type=${type}` : ''}`, // Get Initial Consult Summary Consolidated
      getMacronutrient: ({ clientId }: { clientId: string }) =>
        `/api/portal/clients/${clientId}/macronutrient`, // Get Macronutrient
      generateCalories: () => `/api/portal/clients/generate-calories`, // POST : Generate Calories from recipes

      reports: {
        getAll: () => `/api/portal/clients/reports`, // GET : All Reports List
        getById: ({ clientId, reportId }: { clientId: string; reportId: string }) => `/api/portal/clients/${clientId}/reports/${reportId}`, // GET : Report Detail
        create: () => `/api/portal/clients/reports`, // POST : Send Report for Approval
        update: ({ clientId, reportId }: { clientId: string; reportId: string }) => `/api/portal/clients/${clientId}/reports/${reportId}`, // PUT : Update Report Status
        pdf: ({ clientId, reportId }: { clientId: string; reportId: string }) => `/api/portal/clients/${clientId}/reports/${reportId}/pdf`, // GET : Report PDF
        otherReportsUpload: ({ clientId }: { clientId: string }) => `/api/portal/clients/${clientId}/other-report`, // POST : Upload Other Reports
        otherReportsList: ({ clientId }: { clientId: string }) => `/api/portal/clients/${clientId}/other-report`, // GET : Other Reports List

      },
      mealPlans: {
        get: ({ clientId }: { clientId: string }) =>
          `/api/portal/clients/${clientId}/meal-plans`, // Get Meal Plans history list
        create: ({ clientId }: { clientId: string }) =>
          `/api/portal/clients/${clientId}/meal-plans`, // Create AI- meal plan
        getById: ({ clientId, week }: { clientId: string; week: string }) =>
          `/api/portal/clients/${clientId}/meal-plans/${week}`, // Get Meal Plan Details
        update: ({ clientId, week }: { clientId: string; week: string }) =>
          `/api/portal/clients/${clientId}/meal-plans/${week}`, // Update Meal Plan
        micronutrientInsights: ({
          clientId,
          week,
        }: {
          clientId: string
          week: string
        }) =>
          `/api/portal/clients/${clientId}/meal-plans/${week}/micronutrient-insights`,
        deleteSlot: ({
          clientId,
          week,
          slotName,
        }: {
          clientId: string
          week: string
          slotName: string
        }) =>
          `/api/portal/clients/${clientId}/meal-plans/${week}/slots/${encodeURIComponent(slotName)}`, // Delete meal plan slot
        getApprovalsList: `/api/portal/approvals/meal-plans`, // Get Meal Plan Approvals list

        createMicronutrientInsight: ({ clientId, week }: { clientId: string; week: string }) =>
          `/api/portal/clients/${clientId}/meal-plans/${week}/micronutrient-insights`, // POST Create Micronutrient Insight
        getMicronutrientInsights: ({ clientId, week }: { clientId: string; week: string }) =>
          `/api/portal/clients/${clientId}/meal-plans/${week}/micronutrient-insights`, // GET Micronutrient Insights
        updateMicronutrientInsight: ({ clientId, week }: { clientId: string; week: string }) =>
          `/api/portal/clients/${clientId}/meal-plans/${week}/micronutrient-insights`, // PUT Update Micronutrient Insight
        groceryList: '/api/portal/meal-plans/grocery-list', // GET Portal Grocery List
        groceryListConfirm: '/api/portal/meal-plans/grocery-list/confirm', // PUT Confirm Portal Grocery Purchases
      },
      mealPlanTemplate: {
        createUseCase: '/api/portal/meal-planner/use-cases', //  POST Create Meal Plan Template
        getUseCaseList: '/api/portal/meal-planner/use-cases-list', //  GET Meal Plan Template Use Cases
        getUseCaseMeal: '/api/portal/meal-planner/use-cases-meal', //  GET Meal Plan Template Meal detail
        updateUseCaseMeal: '/api/portal/meal-planner/use-cases-meal' //  PUT Update Meal Plan Template Meal
      },
      mealLogs: {
        get: ({ clientId }: { clientId: string }) =>
          `/api/portal/clients/${clientId}/meal-logs`, // Get meal log timeline
        getHistory: ({ clientId }: { clientId: string }) =>
          `/api/portal/clients/${clientId}/meal-logs/history`, // Get meal log history (stats + timeline)
        getStats: ({ clientId }: { clientId: string }) =>
          `/api/portal/clients/${clientId}/meal-logs/stats`, // Get meal log summary stats
        getAdherence: ({ clientId }: { clientId: string }) =>
          `/api/portal/clients/${clientId}/meal-logs/adherence`, // Get meal log adherence summary
      },
      publishPlan: {
        getPlanSelectionOptions: ({ clientId }: { clientId: string }) =>
          `/api/portal/clients/${clientId}/plan-selection/options`, // Get Plan Selection Options
        getPlanSelectionDetails: ({ clientId }: { clientId: string }) =>
          `/api/portal/clients/${clientId}/plan-selection/details`, // Get Plan Selection Details
      },
      recipeUsage: {
        summary: ({ clientId }: { clientId: string }) =>
          `/api/portal/clients/${clientId}/recipe-usage/summary`,
        list: ({ clientId }: { clientId: string }) =>
          `/api/portal/clients/${clientId}/recipe-usage`,
        heatmap: ({ clientId }: { clientId: string }) =>
          `/api/portal/clients/${clientId}/recipe-usage/heatmap`,
        detail: ({ clientId, recipeId }: { clientId: string; recipeId: string }) =>
          `/api/portal/clients/${clientId}/recipe-usage/${recipeId}`,
      },
      familyMealPlans: {
        getFamilyMealPlanProfile: ({ customerId }: { customerId: string }) =>
          `/api/portal/clients/${customerId}/family-meal-plan-profile`, // Get Family Meal Plan Profile Endpoint
        create: ({ clientId }: { clientId: string }) =>
          `/api/portal/clients/${clientId}/family-meal-plans`, // POST: Create Family Meal Plan
      },
    },
  },

  userInventory: {
    dashboard: '/api/portal/user-inventory/dashboard',
    categoryDetail: '/api/portal/user-inventory/category-detail',
    allInventory: '/api/portal/user-inventory/all-inventory',
    adjustInventory: '/api/portal/user-inventory/adjust-inventory',
    inventoryLog: '/api/portal/user-inventory/inventory-log',
    boxOfLife: '/api/portal/user-inventory/box-of-life',
    nutricart: {
      history: '/api/portal/nutricart/history',
      draft: '/api/portal/nutricart/draft',
      detail: (id: number | string) => `/api/portal/nutricart/detail/${id}`,
      saveDraft: '/api/portal/nutricart/save-draft',
      addItem: '/api/portal/nutricart/add-item',
      removeItem: (itemId: number | string) => `/api/portal/nutricart/remove-item/${itemId}`,
      reviewItem: (itemId: number | string) => `/api/portal/nutricart/review-item/${itemId}`,
      scanInventory: (customerId: string) => `/api/portal/nutricart/add-to-nutricart/${customerId}`,
      sendToClient: (id: number | string) => `/api/portal/nutricart/send-to-client/${id}`,
      nutritionCoverage: (cartId: number | string) => `/api/portal/nutricart/nutrition-coverage/${cartId}`,
      notes: '/api/portal/nutricart/notes',
      preferences: '/api/portal/nutricart/preferences',
      updatePreference: '/api/portal/nutricart/update-preference',
    }
  },
  biohacks: {
    get: '/api/portal/biohacks',
    create: '/api/portal/biohacks',
    getById: (biohackId: string) => `/api/portal/biohacks/${biohackId}`,
    update: (biohackId: string) => `/api/portal/biohacks/${biohackId}`,
    delete: (biohackId: string) => `/api/portal/biohacks/${biohackId}`,
  },
  vaultBiohack: {
    list: '/api/gen-portal/vault/bio-hacks',
    create: '/api/gen-portal/vault/bio-hacks',
    byId: (id: string) => `/api/gen-portal/vault/bio-hacks/${id}`,
    hackTypes: '/api/gen-portal/vault/bio-hacks/hack-types',
    createHackType: '/api/gen-portal/vault/bio-hacks/hack-types',
    targetingOptions: '/api/gen-portal/vault/bio-hacks/targeting-options',
  },
  clientBiohacks: {
    get: '/api/portal/client-biohacks',
    getById: (id: string) => `/api/portal/client-biohacks/${id}`,
    getByCustomer: (customerId: string) => `/api/portal/client-biohacks/customer/${customerId}`,
    pendingApproval: '/api/portal/client-biohacks/pending-approval',
  },
  nutritionistNotes: {
    submit: '/api/portal/nutritionist-notes/submit',
    getClientHistory: (clientId: string) => `/api/portal/nutritionist-notes/client/${clientId}`,
  },
  consultationNotes: {
    getAll: (clientId: string) =>
      `/api/portal/clients/${clientId}/consultation-notes`,
    createAll: (clientId: string) =>
      `/api/portal/clients/${clientId}/consultation-notes`,
    updateAll: (clientId: string) =>
      `/api/portal/clients/${clientId}/consultation-notes`,
    allNotes: (clientId: string) =>
      `/api/portal/clients/${clientId}/consultation-notes/timeline`,
    conditionNotes: {
      list: (clientId: string) =>
        `/api/portal/clients/${clientId}/consultation-notes/condition-notes`,
      create: (clientId: string) =>
        `/api/portal/clients/${clientId}/consultation-notes/condition-notes`,
      update: (clientId: string, noteId: string) =>
        `/api/portal/clients/${clientId}/consultation-notes/condition-notes/${noteId}`,
      delete: (clientId: string, noteId: string) =>
        `/api/portal/clients/${clientId}/consultation-notes/condition-notes/${noteId}`,
    },
    followUpActions: {
      list: (clientId: string) =>
        `/api/portal/clients/${clientId}/consultation-notes/follow-up-actions`,
      create: (clientId: string) =>
        `/api/portal/clients/${clientId}/consultation-notes/follow-up-actions`,
      update: (clientId: string, actionId: string) =>
        `/api/portal/clients/${clientId}/consultation-notes/follow-up-actions/${actionId}`,
      delete: (clientId: string, actionId: string) =>
        `/api/portal/clients/${clientId}/consultation-notes/follow-up-actions/${actionId}`,
    },
    generalObservations: {
      list: (clientId: string) =>
        `/api/portal/clients/${clientId}/consultation-notes/general-observations`,
      create: (clientId: string) =>
        `/api/portal/clients/${clientId}/consultation-notes/general-observations`,
      update: (clientId: string, noteId: string) =>
        `/api/portal/clients/${clientId}/consultation-notes/general-observations/${noteId}`,
      delete: (clientId: string, noteId: string) =>
        `/api/portal/clients/${clientId}/consultation-notes/general-observations/${noteId}`,
    },
  },
  desk: {
    overview: '/api/gen-portal/desk/overview',
    tasks: '/api/gen-portal/desk/tasks',
    taskById: (taskId: string) => `/api/gen-portal/desk/tasks/${taskId}`,
    performance: '/api/gen-portal/desk/performance',
    profile: '/api/gen-portal/desk/profile',
  },
  nutritionistSchedule: {
    pageData: '/api/gen-portal/nutritionist/schedules/page-data',
    availability: '/api/gen-portal/nutritionist/availability',
    appointments: '/api/gen-portal/nutritionist/appointments',
    appointmentById: (id: string) =>
      `/api/gen-portal/nutritionist/appointments/${id}`,
    appointmentMessages: (id: string) =>
      `/api/gen-portal/nutritionist/appointments/${id}/messages`,
    timelineSlots: '/api/gen-portal/nutritionist/timeline/slots',
    timelineSlotById: (id: string) =>
      `/api/gen-portal/nutritionist/timeline/slots/${id}`,
    workBlockById: (id: string) =>
      `/api/gen-portal/nutritionist/work-blocks/${id}`,
  },
  nutritionistLeave: {
    pageData: '/api/gen-portal/nutritionist/leaves/page-data',
    leaves: '/api/gen-portal/nutritionist/leaves',
    leaveById: (id: string) => `/api/gen-portal/nutritionist/leaves/${id}`,
  },
}



