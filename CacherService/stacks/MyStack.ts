import { StackContext, Api, EventBus, Function } from "sst/constructs";

export function API({ stack }: StackContext) {

  const func = new Api(stack, "Handler",  {
    routes: {
      "GET /": {
        function: {
          handler: "./src/handler",
          runtime: "python3.11",
        }
      }
    },
  })

  stack.addOutputs({
    FuncEndpoint: func.url,
  });
}
