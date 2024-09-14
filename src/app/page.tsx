import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="bg-stone-700 w-screen h-screen">
      <Card className="bg-stone-900 w-fit">
        <CardHeader>
          header
          <CardTitle >Title</CardTitle>
        </CardHeader>
        <CardContent>
          content
          <CardDescription>description</CardDescription>
        </CardContent>
        <CardFooter>
          footer
        </CardFooter>
      </Card>
      
    </div>
  );
}
