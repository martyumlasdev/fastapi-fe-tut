1.  Project structure              ✅
2.  Server/Client Components       ← next concept
3.  API integration                🔄
4.  Authentication                 🔄
5.  State & forms
6.  Blog UI
7.  Dashboard
8.  Routing/navigation
9.  Data fetching architecture
10. Production considerations


                 fetchWithErrorHandling()
                          │
             ┌────────────┴────────────┐
             │                         │
        HTTP response              No response
             │                         │
        response.ok?               fetch throws
             │                         │
       ┌─────┴─────┐                   │
      yes           no                  │
       │             │                  │
    return       ApiError              │
    response     status 401/404/500    │
                     │                  │
                     └──────┬───────────┘
                            │
                        ApiError